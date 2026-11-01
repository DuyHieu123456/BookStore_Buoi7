import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { CartItemRow } from "../components/CartItemRow";
import { useCart } from "../store/hooks";
import { TabScreenProps } from "../navigation/types";
import { colors, formatPrice, radius } from "../theme";

// đọc giỏ hàng từ store (không còn mock cứng); nút Thanh toán → Checkout
export function CartScreen({ navigation }: TabScreenProps<"Cart">) {
  // BT7.3f: đọc giỏ từ Redux qua hook adapter useCart
  const { items, totalPrice } = useCart();

  return (
    <View style={styles.container}>
      <Header title="🛒 Giỏ hàng" />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.bookId)}
        renderItem={({ item }) => <CartItemRow item={item} />}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        ListEmptyComponent={<Text style={styles.empty}>Giỏ hàng trống</Text>}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Tổng cộng: {formatPrice(totalPrice)}</Text>
        <Pressable
          style={[styles.btn, items.length === 0 && styles.btnDisabled]}
          disabled={items.length === 0}
          // BT7.2b: gửi tổng tiền sang màn Thanh toán
          onPress={() => navigation.navigate("Checkout", { total: totalPrice })}
        >
          <Text style={styles.btnText}>Thanh toán</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  empty: { textAlign: "center", color: colors.muted, marginTop: 40 },
  footer: { backgroundColor: "#fff", padding: 14, gap: 10, borderTopWidth: 1, borderTopColor: colors.line },
  total: { fontSize: 17, fontWeight: "800", color: colors.navy },
  btn: { backgroundColor: colors.indigo, padding: 14, borderRadius: radius.md, alignItems: "center" },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
