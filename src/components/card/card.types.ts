import type { Data } from "@/types/data";

export type CardProps = {
  item: Data;
  selected: boolean;
  qty: number;
  handleSelectCart: () => void;
  handleCount: (type: "increment" | "decrement") => void;
};
