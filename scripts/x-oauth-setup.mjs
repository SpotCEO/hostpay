import { pathToFileURL } from 'node:url';
import { CALLBACK, SCOPES, startSetup } from './x-oauth-setup-core.mjs';
import { prepareHandoff, vercelHandoff, cleanupHandoff, BUNDLE_PATH } from './x-oauth-operator.mjs';

export async function main(args=process.argv.slice(2),env=process.env,log=console.log) {
  if(args.length===0 || (args.length===1 && args[0]==='--help')) {
    log('HOSTPAY private X OAuth2 setup. Callback: '+CALLBACK);
    log('Scopes: '+SCOPES);
    log('Commands: authorize | handoff-vercel | cleanup --confirmed-durable');
    log('Use trusted process environment X_CLIENT_ID and X_CLIENT_SECRET. Never put secrets in arguments.');
    return 0;
  }
  try {
    if(args.length===1 && args[0]==='authorize') {
      if(!env.X_CLIENT_ID || !env.X_CLIENT_SECRET)throw Error('MISSING_CLIENT_CREDENTIALS');
      const handoff=await prepareHandoff();
      const session=await startSetup({clientId:env.X_CLIENT_ID,clientSecret:env.X_CLIENT_SECRET,handoff,log});
      const cancel=()=>void session.cancel();process.once('SIGINT',cancel);process.once('SIGTERM',cancel);
      const result=await session.done;process.off('SIGINT',cancel);process.off('SIGTERM',cancel);
      if(!result.ok){log('Authorization incomplete. ROBO remains disabled.');return 1;}
      log('SENSITIVE local credential file: '+BUNDLE_PATH);
      log('Do not display/share/commit this file. Use handoff-vercel privately, then cleanup only after secure transfer and durable encrypted storage are verified.');
      return 0;
    }
    if(args.length===1 && args[0]==='handoff-vercel'){await vercelHandoff({env,log});return 0;}
    if(args.length===2 && args[0]==='cleanup' && args[1]==='--confirmed-durable') {
      await cleanupHandoff(true);log('Exact local handoff files removed. Secure erasure of disk/backups is not guaranteed.');return 0;
    }
    log('Invalid command. No credentials or configuration values are accepted as arguments.');return 1;
  } catch {
    // Never serialize native HTTP, filesystem, subprocess or provider errors.
    log('Setup stopped safely. Check private environment, port 8080, file permissions and retained handoff state. Do not share credential files or callback URLs.');
    return 1;
  }
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)process.exitCode=await main();
