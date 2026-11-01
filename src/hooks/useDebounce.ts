import { useEffect, useState } from "react";

// Trả về giá trị "đã trễ": chỉ cập nhật sau khi người dùng ngừng gõ `delay` ms
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    // TODO BT7.7b: setTimeout(() => setDebounced(value), delay) và return hàm dọn dẹp clearTimeout
    //   (gõ tiếp → huỷ hẹn giờ cũ). Hiện tại hook trả value ngay → KHÔNG có debounce.
    setDebounced(value);
    void delay;
  }, [value, delay]);
  return debounced;
}
