import { refreshJwtConfig } from '../configs/jwt.config';

const convertToMilliseconds = (duration: string): number => {
    const match = duration.match(/^(\d+)d$/); // Extract number of days
    if (!match) throw new Error("Invalid format. Use 'Xd' (e.g., '5d').");
    
    const days = parseInt(match[1], 10);
    return days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
};

/** Returns the token expiration date */
export function getTokenExpirationDate(): Date {

  const expiresInDays =
convertToMilliseconds(refreshJwtConfig.expiresIn as string) / 1000 / 60 / 60 / 24;

  const expiresAt = addDaysFromNow(expiresInDays);

  return expiresAt;
}

/** Add amount of days from today's date */
function addDaysFromNow(days: number): Date {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}
