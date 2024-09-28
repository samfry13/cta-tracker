"use client";

import { useEffect, useState } from "react";
import z from "zod";

export const roundToNearestQuarter = (num: number) => {
  return Math.round(num * 4) / 4;
};

export const useLocalStorage = <T extends z.ZodSchema>(
  key: string,
  schema: T,
  initialValue: z.infer<T>,
) => {
  const [value, setValue] = useState<z.infer<T>>(() => {
    try {
      const storageValue = JSON.parse(localStorage.getItem(key) ?? "");
      const parsedStorageValue = schema.safeParse(storageValue);

      if (parsedStorageValue.success) return parsedStorageValue.data;
    } catch (e) {
      console.error(e);
    }

    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

export type ValueOf<T extends object> = T[keyof T];
