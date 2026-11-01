import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useAuth } from "../store/hooks";
import { colors, radius } from "../theme";

// Tab Tài khoản hiển thị KHÁC NHAU theo isLoggedIn.
// Dữ liệu đăng nhập đang là GIẢ  — đăng nhập thật qua API làm ở buổi sau.
export function AccountScreen() {
  const { user, isLoggedIn, signIn, signOut } = useAuth();
  // TODO BT7.4c: kiểm tra 2 nhánh JSX bên dưới hiển thị đúng khi isLoggedIn đổi (cần xong BT7.4a, BT7.4b)
  // TODO BT7.4d: nút đăng nhập thử gọi signIn(user giả, "fake-token"); nút Đăng xuất gọi signOut

  return (
    <View style={styles.container}>
      <Header title="👤 Tài khoản" />
      {isLoggedIn && user ? (
        <View style={styles.box}>
          <Text style={styles.avatar}>🙂</Text>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Pressable style={[styles.btn, styles.btnOutline]} onPress={() => void signOut}>
            <Text style={styles.btnOutlineText}>Đăng xuất</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.box}>
          <Text style={styles.avatar}>🔒</Text>
          <Text style={styles.name}>Bạn chưa đăng nhập</Text>
          <Pressable
            style={styles.btn}
            onPress={() => void signIn}
          >
            <Text style={styles.btnText}>Đăng nhập thử (dữ liệu giả)</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  box: { alignItems: "center", padding: 24, gap: 8 },
  avatar: { fontSize: 64 },
  name: { fontSize: 20, fontWeight: "800", color: colors.text },
  email: { color: colors.muted },
  btn: { backgroundColor: colors.indigo, paddingVertical: 12, paddingHorizontal: 20, borderRadius: radius.md, marginTop: 12 },
  btnText: { color: "#fff", fontWeight: "800" },
  btnOutline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.indigo },
  btnOutlineText: { color: colors.indigo, fontWeight: "800" },
});
