import { refreshJwtConfig } from '../configs/jwt.config';

/** Returns the token expiration date */
export function getTokenExpirationDate(): Date {

  const expiresInDays =
new Date(refreshJwtConfig.expiresIn as string).getTime() / 1000 / 60 / 60 / 24;

  const expiresAt = addDaysFromNow(expiresInDays);

  return expiresAt;
}

/** Add amount of days from today's date */
function addDaysFromNow(days: number): Date {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}
