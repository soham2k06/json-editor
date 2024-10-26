import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DataType } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStoredData = (key: string, defaultValue: any) => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  }
  return defaultValue;
};

export const setStoredData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getTypeString = (element: any): string => {
  return Object.prototype.toString
    .call(element)
    .match(/\w+/g)?.[1]
    .toLowerCase() as string;
};

const setNewValue: any = (keys: string[], obj: any, newElement: any) => {
  const index: any = keys.shift();
  const objKeys: string[] = Object.keys(obj);
  if (keys.length) {
    return setNewValue(keys, obj[objKeys[index]], newElement);
  }
  obj[objKeys[index]] = newElement;
};

export const getQuoteAddress = (
  newElement: any,
  indexKeys: string[],
  currentData: {
    [keyof: string]: any;
  }
) => {
  setNewValue(indexKeys, currentData, newElement);
  return currentData;
};

export const getKeyList = (uniqueKey: string) => {
  // because first index is root index, don't find it.
  return uniqueKey.split("-").slice(1);
};

export const isObject = (value: any) => {
  return value && typeof value === "object";
};
