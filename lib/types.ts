type NestedHeaders = {
  [key: string]: NestedHeaders | null;
};

interface NewData {
  key: string;
  value: string;
}

export type { NewData };
