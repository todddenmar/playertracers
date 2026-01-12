import { clsx, type ClassValue } from "clsx";
import { format, isAfter, isToday } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertCurrency = (value: number) => {
  const formatted = new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  return formatted;
};

export const pluralize = ({
  number,
  plural,
  singular,
}: {
  number: number;
  plural: string;
  singular: string;
}) => {
  if (number > 1) {
    return `${number} ${plural}`;
  } else {
    return `${number} ${singular}`;
  }
};

export const calculateAge = (dateString: string): number => {
  const birthdate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthdate.getDate())
  ) {
    age--;
  }

  return age;
};

export const formatDate = (date: Date, withTime?: boolean) => {
  return withTime ? format(date, "Pp") : format(date, "PP");
};

export const customDateFormat = (date: Date, withTime?: boolean) => {
  return withTime
    ? format(date, "MMMM d, yyyy p")
    : format(date, "MMMM d, yyyy");
};

export const formatTime = (time: TTime) => {
  return `${time.hour}:${time.minute} ${time.period}`;
};

export const formatBibNumber = (num: number, length: number = 3): string => {
  return num.toString().padStart(length, "0");
};
export const countDigits = (num: number): number => {
  return Math.abs(num).toString().length;
};
export function getOrdinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

// Haversine formula to calculate distance between two points (lat, lon)
// const haversineDistance = ([lat1, lon1]: number[], [lat2, lon2]: number[]) => {
//   const R = 6371e3; // Radius of Earth in meters
//   const toRad = (deg: number) => (deg * Math.PI) / 180;

//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // Distance in meters
// };

export const checkIfEarlyBirdCutOff = (date: Date) => {
  const isCutOffToday = isToday(date);
  const isCutOff = isAfter(new Date(), date);
  return isCutOffToday || isCutOff;
};

export const getCashPrize = (text: string | undefined) => {
  if (!text) return 0;
  const number = text.match(/\d+/)?.[0]; // Extracts first number
  return number ? parseInt(number) : 0;
};

export const getShortBankName = (name: string) => {
  const match = name.match(/\(([^)]+)\)/);
  const result = match ? match[1] : name;
  return result;
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
};

import * as XLSX from "xlsx";

export function exportToExcel<T>(data: T[], fileName = "data.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, fileName);
}

// type ShirtSizeCount = {
//   categoryName: string;
//   shirtSizes: Record<string, number>; // e.g., { S: 10, M: 15, L: 5 }
// };

export const getElapsedTime = (
  gunStart: string,
  scanTime: string
): {
  durationStr: string;
  totalSeconds: number;
} => {
  const today = "2025-07-03"; // fixed or from CSV row

  const gun = new Date(`${today}T${gunStart}`);
  const scan = new Date(`${today}T${scanTime}`);

  const diffMs = scan.getTime() - gun.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return {
    durationStr: `${hours}:${minutes}:${seconds}`,
    totalSeconds,
  };
};

import imageCompression from "browser-image-compression";
import { TTime } from "@/typings";

/**
 * Compresses and converts an image file to WebP format.
 * @param file Original image file (jpeg, png, etc.)
 * @returns A Promise<File> of the compressed WebP image
 */
export async function compressImageToWebP(file: File): Promise<File | null> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 720,
    useWebWorker: true,
    fileType: "image/webp", // ⬅️ Output as WebP,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Compression failed:", error);
    return null;
  }
}

export const formatTimeTo12Hour = (time24: string) => {
  const [hours, minutes] = time24.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", // Include minutes
    hour12: true,
  }); // remove space between number and AM/PM
};

export const isWithinRegistrationHours = (
  start: string, // e.g. "04:00"
  end: string // e.g. "21:00"
) => {
  const now = new Date();
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
};

export function hhmmssToSeconds(time: string): number {
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

export const normalizeTeamName = (teamName: string) => {
  return teamName?.toLowerCase().replace(/\s+/g, " ").replace(/\./g, "").trim();
};

// Utility: get unique color per category
export const generateColor = (index: number) => {
  const palette = [
    "#f87171", // red
    "#60a5fa", // blue
    "#34d399", // green
    "#fbbf24", // yellow
    "#a78bfa", // purple
    "#fb7185", // pink
    "#22d3ee", // cyan
  ];
  return palette[index % palette.length];
};
