// ADAPTER: component chỉ gọi useCart() / useAuth() / useWishlist().
// Nếu sau này đổi sang Recoil/Zustand, chỉ sửa file này — UI không phải sửa.
import { useCallback, useMemo } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";
import { addItem, clearCart, removeItem, setQuantity } from "./cartSlice";
import { logout, setCredentials, updateUser } from "./authSlice";
import { toggleWishlist } from "./wishlistSlice";
import { CartItem, User } from "../types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  // TODO BT7.3b: totalQuantity = tổng quantity · totalPrice = tổng price * quantity (dùng reduce; useMemo theo [items])
  const totalQuantity = useMemo(() => 0 * items.length, [items]);
  const totalPrice = useMemo(() => 0 * items.length, [items]);

  return {
    items,
    totalQuantity,
    totalPrice,
    add: useCallback((book: Omit<CartItem, "quantity">) => dispatch(addItem(book)), [dispatch]),
    remove: useCallback((bookId: number) => dispatch(removeItem(bookId)), [dispatch]),
    setQty: useCallback((bookId: number, quantity: number) => dispatch(setQuantity({ bookId, quantity })), [dispatch]),
    clear: useCallback(() => dispatch(clearCart()), [dispatch]),
  };
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  return {
    user,
    token,
    isLoggedIn: false, // TODO BT7.4b: true khi có cả token lẫn user  →  !!token && !!user
    signIn: useCallback((u: User, t: string) => dispatch(setCredentials({ user: u, token: t })), [dispatch]),
    signOut: useCallback(() => dispatch(logout()), [dispatch]),
    patchUser: useCallback((p: Partial<User>) => dispatch(updateUser(p)), [dispatch]),
  };
}

export function useWishlist() {
  const dispatch = useAppDispatch();
  const ids = useAppSelector((s) => s.wishlist.ids);
  return {
    ids,
    isFavorite: useCallback((bookId: number) => ids.includes(bookId), [ids]),
    toggle: useCallback((bookId: number) => dispatch(toggleWishlist(bookId)), [dispatch]),
  };
}
