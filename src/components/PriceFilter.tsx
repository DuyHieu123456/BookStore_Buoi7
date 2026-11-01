import React from "react";
import { PriceRange } from "../utils/filters";
import { TodoBox } from "./TodoBox";

interface Props {
  value: PriceRange;
  onChange: (v: PriceRange) => void;
}

// THỬ THÁCH: 3 nút lọc khoảng giá (bấm lần nữa để bỏ chọn)
export function PriceFilter({ value, onChange }: Props) {
  // TODO BT7.C2: render 3 nút từ PRICE_RANGES (import từ utils/filters); nút đang chọn có nền cyan (colors.cyan)
  //   active = value === r.key · onPress = onChange(active ? null : r.key)   (mẫu: xem CategoryChips)
  void value; void onChange;
  return <TodoBox id="BT7.C2">Thử thách: 3 nút lọc giá — Dưới 100k / 100k–300k / Trên 300k.</TodoBox>;
}
