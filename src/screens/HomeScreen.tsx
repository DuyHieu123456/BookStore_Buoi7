import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { PriceFilter } from "../components/PriceFilter";
import { BookGrid } from "../components/BookGrid";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { TodoBox } from "../components/TodoBox";
// import { EmptyState } from "../components/EmptyState";
// import { LoadingView } from "../components/LoadingView";
// import { ErrorView } from "../components/ErrorView";
// import { getBooks } from "../services/bookService";
// import { getCategories } from "../services/categoryService";
// import { getErrorMessage } from "../api/client";
// import { useDebounce } from "../hooks/useDebounce";
// import { filterBooks } from "../utils/filters";
import { MOCK_BOOKS, MOCK_CATEGORIES } from "../data/mockBooks"; // ← dữ liệu GIẢ
import { PriceRange } from "../utils/filters";
import { TabScreenProps } from "../navigation/types";
import { colors } from "../theme";

export function HomeScreen({ navigation }: TabScreenProps<"Home">) {
  // TODO BT7.3d: lấy { totalQuantity } từ useCart() và truyền vào <FloatingCartButton count=... />

  // TODO BT7.5b: thay dữ liệu giả bằng state: books, categories, loading, error  (useState)
  //   rồi viết hàm load() gọi SONG SONG: const [b, c] = await Promise.all([getBooks(), getCategories()])
  //   gọi load() trong useEffect(…, []) — nhớ try/catch/finally.
  const books = MOCK_BOOKS;
  const categories = MOCK_CATEGORIES;

  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);

  // TODO BT7.7a: const debouncedKeyword = useDebounce(keyword, 400);
  // TODO BT7.7c: visibleBooks = useMemo(() => filterBooks(books, { keyword: debouncedKeyword, categoryId, priceRange }), [...])
  const visibleBooks = books;

  // TODO BT7.8b: nhận categoryId từ route.params (Tab Danh mục gửi sang) → setCategoryId(id) rồi navigation.setParams({ categoryId: undefined })

  // TODO BT7.5c: hiển thị <LoadingView/> khi loading, <ErrorView message onRetry={load}/> khi error, ngược lại là BookGrid
  // TODO BT7.7d: ListEmptyComponent = <EmptyState emoji="🔎" title="Không tìm thấy sách phù hợp" … actionLabel="Xóa bộ lọc" /> + hàm clearFilters
  // TODO BT7.7e: nút "✕ Xóa bộ lọc" (chỉ hiện khi đang có bộ lọc) trong header của lưới

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
      <BookGrid
        data={visibleBooks}
        // TODO BT7.2a: onPressBook → navigation.navigate("BookDetail", { bookId: b.id })
        onPressBook={() => {}}
        ListHeaderComponent={
          <View>
            <CategoryChips categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
            <PriceFilter value={priceRange} onChange={setPriceRange} />
            <TodoBox id="BT7.5b">Màn Home đang dùng dữ liệu GIẢ (mockBooks). Hãy nối API json-server.</TodoBox>
          </View>
        }
      />
      <FloatingCartButton count={0} onPress={() => navigation.navigate("Cart")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});
