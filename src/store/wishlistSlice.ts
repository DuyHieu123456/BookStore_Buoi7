import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  ids: number[];
}
const initialState: WishlistState = { ids: [] };

// THỬ THÁCH (BT7.C1) — dùng lại ở buổi sau
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // BT7.C1: id đã có → bỏ ra, chưa có → thêm vào (toggle)
    toggleWishlist(state, action: PayloadAction<number>) {
      const i = state.ids.indexOf(action.payload);
      if (i >= 0) state.ids.splice(i, 1);
      else state.ids.push(action.payload);
    },
    hydrateWishlist(state, action: PayloadAction<number[]>) {
      state.ids = action.payload;
    },
  },
});

export const { toggleWishlist, hydrateWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
