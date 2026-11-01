import { useEffect, useState } from "react";

// Trả về giá trị "đã trễ": chỉ cập nhật sau khi người dùng ngừng gõ `delay` ms
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    // BT7.7b: hẹn giờ cập nhật; gõ tiếp → hàm dọn dẹp huỷ hẹn giờ cũ
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
