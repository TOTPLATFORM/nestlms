import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(dateString: string) {
  if (dateString) {
    return moment(dateString).format("MMMM Do YYYY");
  }

  return "";
}
