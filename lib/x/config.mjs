export const EXPECTED_USERNAME = 'HOSTPAY_SOL';
export const TELEGRAM_URL = 'https://t.me/HOSTPAYOfficial';
export const idValid = value => typeof value === 'string' && /^[1-9][0-9]{0,24}$/.test(value);
export function configured(env) {
  return env.X_ROBO_ENABLED === 'true' && env.X_AI_APPROVAL_CONFIRMED === 'true' &&
    Boolean(env.X_CLIENT_ID && env.X_CLIENT_SECRET && env.X_DATABASE_URL && env.OPENAI_API_KEY) &&
    /^[A-Za-z0-9+/]{43}=$/.test(env.X_TOKEN_ENCRYPTION_KEY ?? '') &&
    idValid(env.X_ACCOUNT_ID);
}
