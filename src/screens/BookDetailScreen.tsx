import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBookById } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useCart, useWishlist } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { Book } from "../types";
import { colors, formatPrice, radius } from "../theme";

// gọi getBookById thay cho mảng tĩnh; có loading + lỗi + thử lại
export function BookDetailScreen({ route }: RootScreenProps<"BookDetail">) {
  const { bookId } = route.params;
  const { add } = useCart();
  // BT7.C1: yêu thích (wishlist) qua hook adapter
  const { isFavorite, toggle } = useWishlist();
  const favorite = isFavorite(bookId);

  // BT7.5d: state + load() gọi API theo bookId nhận qua route.params (Bài 7.2)
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBook(await getBookById(bookId));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    load();
  }, [load]);

  // BT7.5e: kiểm tra loading / lỗi TRƯỚC khi dùng book
  if (loading) return <LoadingView />;
  if (error || !book)
    return <ErrorView message={error ?? "Không tìm thấy sách."} onRetry={load} />;

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
      {/* BT7.3c: thêm vào giỏ (payload không có quantity — slice tự gán) */}
      <Pressable
        style={styles.btn}
        onPress={() =>
          add({
            bookId: book.id,
            title: book.title,
            price: book.price,
            emoji: book.emoji,
            color: book.color,
            stock: book.stock,
          })
        }
      >
        <Text style={styles.btnText}>Thêm vào giỏ</Text>
      </Pressable>
      {/* BT7.C1: nút yêu thích ♡/♥ — trạng thái nằm ở wishlistSlice, đổi qua useWishlist().toggle */}
      <Pressable style={styles.favBtn} onPress={() => toggle(book.id)}>
        <Text style={styles.favText}>{favorite ? "♥ Đã yêu thích" : "♡ Yêu thích"}</Text>
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
  favBtn: { borderWidth: 1.5, borderColor: colors.heart, padding: 14, borderRadius: radius.md, alignItems: "center", marginTop: 4 },
  favText: { color: colors.heart, fontWeight: "800", fontSize: 16 },
});
