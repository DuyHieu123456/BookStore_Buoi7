import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { PriceFilter } from "../components/PriceFilter";
import { BookGrid } from "../components/BookGrid";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBooks } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import { getErrorMessage } from "../api/client";
import { useDebounce } from "../hooks/useDebounce";
import { filterBooks, PriceRange } from "../utils/filters";
import { useCart } from "../store/hooks";
import { Book, Category } from "../types";
import { TabScreenProps } from "../navigation/types";
import { colors, radius } from "../theme";

// Câu hỏi bổ sung 5: thêm state sắp xếp giá — "asc" tăng dần, "desc" giảm dần, null = mặc định
type SortKey = "asc" | "desc" | null;
const SORT_OPTIONS: { key: Exclude<SortKey, null>; label: string }[] = [
  { key: "asc", label: "Giá tăng dần" },
  { key: "desc", label: "Giá giảm dần" },
];

export function HomeScreen({ navigation, route }: TabScreenProps<"Home">) {
  // BT7.3d: tổng số lượng trong giỏ cho nút giỏ nổi
  const { totalQuantity } = useCart();

  // BT7.5b: dữ liệu lấy từ API (không còn dữ liệu giả)
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Hai API độc lập → gọi SONG SONG bằng Promise.all
      const [b, c] = await Promise.all([getBooks(), getCategories()]);
      setBooks(b);
      setCategories(c);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);
  const [sort, setSort] = useState<SortKey>(null);

  // BT7.7a: từ khoá chỉ được áp dụng sau khi ngừng gõ 400ms
  const debouncedKeyword = useDebounce(keyword, 400);

  // BT7.8b: nhận categoryId do tab Danh mục gửi sang, dùng xong thì xoá params
  useEffect(() => {
    const id = route.params?.categoryId;
    if (id !== undefined) {
      setCategoryId(id);
      navigation.setParams({ categoryId: undefined });
    }
  }, [route.params?.categoryId, navigation]);

  // BT7.7c + 7.8a + C2: lọc kết hợp, sau đó sắp xếp (câu 5) trên một BẢN SAO
  const visibleBooks = useMemo(() => {
    const filtered = filterBooks(books, {
      keyword: debouncedKeyword,
      categoryId,
      priceRange,
    });
    if (!sort) return filtered;
    return [...filtered].sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
  }, [books, debouncedKeyword, categoryId, priceRange, sort]);

  // BT7.7e: đang có bộ lọc hay không (để hiện nút Xóa bộ lọc)
  const hasFilter = keyword !== "" || categoryId !== null || priceRange !== null;
  const clearFilters = useCallback(() => {
    setKeyword("");
    setCategoryId(null);
    setPriceRange(null);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="📚 BookStore" onSearchPress={() => setSearchOpen((v) => !v)} />
      {searchOpen && (
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          onClose={() => {
            setSearchOpen(false);
            setKeyword("");
          }}
        />
      )}
      {/* BT7.5c: 3 trạng thái — đang tải / lỗi (thử lại) / có dữ liệu */}
      {loading ? (
        <LoadingView label="Đang tải sách…" />
      ) : error ? (
        <ErrorView message={error} onRetry={load} />
      ) : (
        <BookGrid
          data={visibleBooks}
          // BT7.2a: gửi bookId sang màn Chi tiết
          onPressBook={(b) => navigation.navigate("BookDetail", { bookId: b.id })}
          ListHeaderComponent={
            <View>
              <CategoryChips categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
              <PriceFilter value={priceRange} onChange={setPriceRange} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
                {SORT_OPTIONS.map((o) => {
                  const active = sort === o.key;
                  return (
                    <Pressable
                      key={o.key}
                      onPress={() => setSort(active ? null : o.key)}
                      style={[styles.sortBtn, active && styles.sortBtnActive]}
                    >
                      <Text style={[styles.sortText, active && styles.sortTextActive]}>{o.label}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              {/* BT7.7e: chỉ hiện khi đang có bộ lọc */}
              {hasFilter && (
                <Pressable style={styles.clearBtn} onPress={clearFilters}>
                  <Text style={styles.clearText}>✕ Xóa bộ lọc</Text>
                </Pressable>
              )}
            </View>
          }
          // BT7.7d: không có kết quả → EmptyState kèm nút xóa bộ lọc
          ListEmptyComponent={
            <EmptyState
              emoji="🔎"
              title="Không tìm thấy sách phù hợp"
              message="Hãy thử từ khoá khác hoặc bỏ bớt bộ lọc."
              actionLabel="Xóa bộ lọc"
              onAction={clearFilters}
            />
          }
        />
      )}
      <FloatingCartButton count={totalQuantity} onPress={() => navigation.navigate("Cart")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  sortRow: { paddingHorizontal: 12, paddingBottom: 10, gap: 8 },
  sortBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line },
  sortBtnActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  sortText: { color: colors.text, fontWeight: "600" },
  sortTextActive: { color: "#fff", fontWeight: "800" },
  clearBtn: { alignSelf: "flex-start", marginHorizontal: 12, marginBottom: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: "#FEE2E2" },
  clearText: { color: colors.danger, fontWeight: "700" },
});
