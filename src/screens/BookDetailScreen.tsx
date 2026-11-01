import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TodoBox } from "../components/TodoBox";
import { MOCK_BOOKS } from "../data/mockBooks";
// import { LoadingView } from "../components/LoadingView";
// import { ErrorView } from "../components/ErrorView";
// import { getBookById } from "../services/bookService";
// import { getErrorMessage } from "../api/client";
import { useCart } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { Book } from "../types";
import { colors, formatPrice, radius } from "../theme";

// gọi getBookById thay cho mảng tĩnh; có loading + lỗi + thử lại
export function BookDetailScreen({ route }: RootScreenProps<"BookDetail">) {
  const { bookId } = route.params;
  const { add } = useCart();

  // TODO BT7.5d: tạo state book / loading / error và hàm load() gọi getBookById(bookId); chạy trong useEffect([bookId])
  // TODO BT7.5e: if (loading) return <LoadingView/>;  if (error || !book) return <ErrorView message onRetry={load}/>
  // Tạm thời lấy sách từ dữ liệu giả để màn hình có nội dung:
  const book: Book | undefined = MOCK_BOOKS.find((x) => x.id === bookId);
  if (!book) return <TodoBox id="BT7.5e">{`Không có sách #${bookId} trong dữ liệu giả — hãy gọi API.`}</TodoBox>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.cover, { backgroundColor: book.color }]}>
        <Text style={styles.emoji}>{book.emoji}</Text>
      </View>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.price}>{formatPrice(book.price)}</Text>
      <Text style={styles.stock}>Còn {book.stock} cuốn</Text>
      <Text style={styles.desc}>{book.description}</Text>
      {/* TODO BT7.3c: nút "Thêm vào giỏ" → add({ bookId, title, price, emoji, color, stock }) từ book */}
      <Pressable style={styles.btn} onPress={() => void add}>
        <Text style={styles.btnText}>Thêm vào giỏ</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 8 },
  cover: { height: 220, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 90 },
  title: { fontSize: 22, fontWeight: "800", color: colors.text, marginTop: 8 },
  author: { color: colors.muted, fontSize: 15 },
  price: { fontSize: 20, fontWeight: "800", color: colors.indigo },
  stock: { color: colors.muted },
  desc: { color: colors.text, lineHeight: 22, marginTop: 4 },
  btn: { backgroundColor: colors.indigo, padding: 14, borderRadius: radius.md, alignItems: "center", marginTop: 12 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
