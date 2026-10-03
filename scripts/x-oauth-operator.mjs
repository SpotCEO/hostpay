import { mkdir, lstat, realpath, chmod, open, readFile, unlink } from 'node:fs/promises';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { verifyAccount } from './x-oauth-setup-core.mjs';
const execute=promisify(execFile);
export const ROOT=fileURLToPath(new URL('../',import.meta.url));
export const PRIVATE_DIR=join(ROOT,'.env.x-oauth-operator');
export const BUNDLE_PATH=join(PRIVATE_DIR,'credentials.json');
const RECEIPT_PATH=join(PRIVATE_DIR,'handoff-started.json');
export const PROJECT={projectId:'prj_TJyywsnyIBE4D1xKY2I8Jx2kOQ9n',orgId:'team_5maV9ad8vAHWlH8EXXNVXV3R',projectName:'hostpay'};
export const HANDOFF_NAMES=Object.freeze(['X_ACCESS_TOKEN','X_REFRESH_TOKEN','X_ACCESS_TOKEN_EXPIRES_AT','X_ACCOUNT_ID']);

async function safeDirectory() {
  // Refuse reparse points/symlinks; use an existing Git ignore, not a new secret rule.
  await execute('git',['-c','safe.directory='+ROOT,'-C',ROOT,'check-ignore','--quiet','--no-index','.env.x-oauth-operator/credentials.json']);
  await mkdir(PRIVATE_DIR,{mode:0o700}).catch(e=>{if(e.code!=='EEXIST')throw e;});
  const info=await lstat(PRIVATE_DIR);
  if (!info.isDirectory() || info.isSymbolicLink() || resolve(await realpath(PRIVATE_DIR))!==resolve(PRIVATE_DIR)) throw Error('PRIVATE_DIRECTORY_UNSAFE');
  if(process.platform==='win32') {
    // Directory protected before any token write. Inherit only owner and SYSTEM.
    const ps=`$ErrorActionPreference='Stop'
$p=$env:HOSTPAY_OAUTH_DIRECTORY
$sid=[System.Security.Principal.WindowsIdentity]::GetCurrent().User
$system=New-Object System.Security.Principal.SecurityIdentifier('S-1-5-18')
$acl=New-Object System.Security.AccessControl.DirectorySecurity
$acl.SetAccessRuleProtection($true,$false)
foreach($who in @($sid,$system)) {
 $rule=New-Object System.Security.AccessControl.FileSystemAccessRule($who,'FullControl','ContainerInherit,ObjectInherit','None','Allow')
 $acl.AddAccessRule($rule)
}
[System.IO.Directory]::SetAccessControl($p,$acl)
$check=[System.IO.Directory]::GetAccessControl($p)
if(-not $check.AreAccessRulesProtected){throw 'ACL'}
foreach($rule in $check.GetAccessRules($true,$true,[System.Security.Principal.SecurityIdentifier])) {
 if($rule.AccessControlType -eq 'Allow' -and $rule.IdentityReference.Value -notin @($sid.Value,'S-1-5-18')){throw 'ACL'}
}`;
    await execute('powershell.exe',['-NoProfile','-NonInteractive','-Command',ps],{
      env:{...process.env,HOSTPAY_OAUTH_DIRECTORY:PRIVATE_DIR},windowsHide:true,timeout:15000});
  } else {
    await chmod(PRIVATE_DIR,0o700);
    if (((await lstat(PRIVATE_DIR)).mode & 0o077)!==0) throw Error('PRIVATE_DIRECTORY_UNSAFE');
  }
}
async function checkFile(path) {
  const st=await lstat(path);
  if(!st.isFile() || st.isSymbolicLink() || st.nlink!==1 || st.size>65536) throw Error('PRIVATE_FILE_UNSAFE');
  if(process.platform!=='win32' && (st.mode & 0o077)!==0) throw Error('PRIVATE_FILE_UNSAFE');
  if(process.platform==='win32') {
    const ps=`$ErrorActionPreference='Stop'
$sid=[System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
$acl=[System.IO.File]::GetAccessControl($env:HOSTPAY_OAUTH_FILE)
foreach($rule in $acl.GetAccessRules($true,$true,[System.Security.Principal.SecurityIdentifier])) {
 if($rule.AccessControlType -eq 'Allow' -and $rule.IdentityReference.Value -notin @($sid,'S-1-5-18')){throw 'ACL'}
}`;
    await execute('powershell.exe',['-NoProfile','-NonInteractive','-Command',ps],{
      env:{...process.env,HOSTPAY_OAUTH_FILE:path},windowsHide:true,timeout:15000});
  }
}
async function absent(path) {
  try {await lstat(path);} catch(e) {if(e.code==='ENOENT')return;throw e;}
  throw Error('EXISTING_HANDOFF_REVIEW_REQUIRED');
}
export async function prepareHandoff() {
  try {await safeDirectory();await absent(BUNDLE_PATH);await absent(RECEIPT_PATH);}
  catch {throw Error('PRIVATE_HANDOFF_NOT_READY');}
  return async bundle=>{
    // Exclusive create: never truncate/replace an older credential bundle.
    const f=await open(BUNDLE_PATH,'wx',0o600);
    try {await f.writeFile(JSON.stringify(bundle));await f.sync();} finally {await f.close();}
  };
}
export async function readBundle() {
  try {await safeDirectory();await checkFile(BUNDLE_PATH);return JSON.parse(await readFile(BUNDLE_PATH,'utf8'));}
  catch {throw Error('PRIVATE_HANDOFF_UNREADABLE');}
}
export function transferValues(bundle,clientId,now=Date.now) {
  if(bundle?.version!==1 || bundle.username!=='HOSTPAY_SOL' ||
    bundle.clientIdHash!==createHash('sha256').update(clientId ?? '').digest('hex') ||
    !/^[1-9][0-9]{0,24}$/.test(bundle.X_ACCOUNT_ID ?? '') ||
    HANDOFF_NAMES.some(k=>typeof bundle[k]!=='string' || !bundle[k] || /[\r\n\0]/.test(bundle[k])) ||
    !(Date.parse(bundle.X_ACCESS_TOKEN_EXPIRES_AT)>now()+60000)) throw Error('HANDOFF_VALIDATION_FAILED');
  return HANDOFF_NAMES.map(name=>({name,value:bundle[name]}));
}
export function vercelArgs(name) {
  if(!HANDOFF_NAMES.includes(name)) throw Error('HANDOFF_NAME_FORBIDDEN');
  return ['env','add',name,'production','--type','secret','--yes','--scope','spotplatform','--project',PROJECT.projectId];
}
export async function transferBundle({bundle,clientId,send,fetchImpl=fetch,log=()=>{},now=Date.now}) {
  const values=transferValues(bundle,clientId,now);
  const identity=await verifyAccount(bundle.X_ACCESS_TOKEN,{fetchImpl});
  if(identity.id!==bundle.X_ACCOUNT_ID)throw Error('HANDOFF_IDENTITY_MISMATCH');
  for(const {name,value} of values) {
    if(!await send(vercelArgs(name),value))throw Error('HANDOFF_INCOMPLETE');
    log('Transferred Production secret: '+name);
  }
}
export async function vercelHandoff({env=process.env,log=()=>{}}={}) {
  const bundle=await readBundle();transferValues(bundle,env.X_CLIENT_ID);
  const linked=JSON.parse(await readFile(join(ROOT,'.vercel/project.json'),'utf8'));
  if(Object.keys(PROJECT).some(k=>linked[k]!==PROJECT[k]))throw Error('WRONG_VERCEL_PROJECT');
  const cli=env.HOSTPAY_VERCEL_CLI_JS || (env.APPDATA && join(env.APPDATA,'npm/node_modules/vercel/dist/index.js'));
  if(!cli || resolve(cli)!==cli || !(await lstat(cli)).isFile())throw Error('VERCEL_CLI_NOT_FOUND');
  await absent(RECEIPT_PATH);
  // An incomplete/unknown CLI operation must be reviewed, not blindly rerun.
  const receipt=await open(RECEIPT_PATH,'wx',0o600);
  await receipt.writeFile(JSON.stringify({startedAt:new Date().toISOString(),state:'REVIEW_BEFORE_RETRY'}));await receipt.close();
  const childEnv={...env,VERCEL_TELEMETRY_DISABLED:'1'};
  for(const k of Object.keys(childEnv))if(/^(X_|OPENAI_|TELEGRAM_)/.test(k))delete childEnv[k];
  const send=(args,value)=>new Promise(resolveResult=>{
    const child=spawn(process.execPath,['--use-system-ca',cli,...args],{cwd:ROOT,env:childEnv,
      windowsHide:true,stdio:['pipe','ignore','ignore'],timeout:20000});
    child.on('error',()=>resolveResult(false));child.on('close',code=>resolveResult(code===0));
    child.stdin.on('error',()=>{});child.stdin.end(value); // Never argv or console.
  });
  await transferBundle({bundle,clientId:env.X_CLIENT_ID,send,log});
  log('Handoff finished. Keep ROBO disabled. No deployment or activation was performed.');
}
export async function cleanupHandoff(confirmed) {
  if(!confirmed)throw Error('DURABLE_CONFIRMATION_REQUIRED');
  await safeDirectory();
  // Delete exact files only; no recursive directory deletion or broad globs.
  for(const path of [BUNDLE_PATH,RECEIPT_PATH]) {
    try {await checkFile(path);await unlink(path);}catch(e){if(e.code!=='ENOENT')throw Error('CLEANUP_FAILED');}
  }
}
