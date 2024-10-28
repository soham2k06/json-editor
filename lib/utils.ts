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

export function flattenObject(obj: any, prefix = ""): { [key: string]: any } {
  return Object.keys(obj).reduce((acc: { [key: string]: any }, k: string) => {
    const pre = prefix.length ? prefix + "." : "";
    if (
      typeof obj[k] === "object" &&
      obj[k] !== null &&
      !Array.isArray(obj[k])
    ) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

export function unflattenObject(obj: { [key: string]: any }): any {
  const result: any = {};
  for (const key in obj) {
    const keys = key.split(".");
    keys.reduce((r: any, k: string, i: number) => {
      return (r[k] = i === keys.length - 1 ? obj[key] : r[k] || {});
    }, result);
  }
  return result;
}

export function flattenKeys(obj: any, prefix = ""): string[] {
  let keys: string[] = [];

  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          keys = keys.concat(flattenKeys(item, `${prefix}${key}[${index}].`));
        });
      } else {
        keys = keys.concat(flattenKeys(obj[key], `${prefix}${key}.`));
      }
    } else {
      keys.push(`${prefix}${key}`);
    }
  }

  return keys;
}

export function flattenData(obj: any, prefix = "") {
  let result: Record<string, any> = {};

  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          Object.assign(
            result,
            flattenData(item, `${prefix}${key}[${index}].`)
          );
        });
      } else Object.assign(result, flattenData(obj[key], `${prefix}${key}.`));
    } else result[`${prefix}${key}`] = obj[key];
  }

  return result;
}

type NestedObject = { [key: string]: any };

export function unflattenData(data: NestedObject): any {
  const result: any[] = [];
  const objectResult: NestedObject = {};

  for (const [key, value] of Object.entries(data)) {
    const keys = key.split(".");
    let current: NestedObject = objectResult;
    let isRootArray = false;

    for (let i = 0; i < keys.length; i++) {
      const part = keys[i];
      const match = part.match(/^(\d+|[a-zA-Z_]\w*)(\[(\d+)\])?$/);

      if (!match) {
        throw new Error(`Invalid key format: ${part}`);
      }

      const [, objKey, , arrayIndex] = match;

      if (i === 0 && /^\d+$/.test(objKey)) {
        isRootArray = true;
        if (!result[parseInt(objKey)]) {
          result[parseInt(objKey)] = {};
        }
        current = result[parseInt(objKey)];
        continue;
      }

      if (i === keys.length - 1) {
        if (arrayIndex !== undefined) {
          current[objKey] = current[objKey] || [];
          current[objKey][parseInt(arrayIndex)] = value;
        } else {
          current[objKey] = value;
        }
      } else {
        if (arrayIndex !== undefined) {
          current[objKey] = current[objKey] || [];
          current[objKey][parseInt(arrayIndex)] =
            current[objKey][parseInt(arrayIndex)] || {};
          current = current[objKey][parseInt(arrayIndex)];
        } else {
          current[objKey] = current[objKey] || {};
          current = current[objKey];
        }
      }
    }
  }

  return result.length > 0 ? result.filter(Boolean) : objectResult;
}
