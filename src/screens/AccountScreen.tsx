import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useAuth } from "../store/hooks";
import { colors, radius } from "../theme";

// Tab Tài khoản hiển thị KHÁC NHAU theo isLoggedIn.
// Dữ liệu đăng nhập đang là GIẢ  — đăng nhập thật qua API làm ở buổi sau.
export function AccountScreen() {
  const { user, isLoggedIn, signIn, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Header title="👤 Tài khoản" />
      {isLoggedIn && user ? (
        <View style={styles.box}>
          <Text style={styles.avatar}>🙂</Text>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {/* BT7.4d: đăng xuất → authSlice.logout đưa user/token về null */}
          <Pressable style={[styles.btn, styles.btnOutline]} onPress={signOut}>
            <Text style={styles.btnOutlineText}>Đăng xuất</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.box}>
          <Text style={styles.avatar}>🔒</Text>
          <Text style={styles.name}>Bạn chưa đăng nhập</Text>
          {/* BT7.4d: đăng nhập thử (giả lập) với user demo + token giả */}
          <Pressable
            style={styles.btn}
            onPress={() =>
              signIn(
                { id: 1, name: "Học viên Demo", email: "demo@bookstore.vn" },
                "fake-token"
              )
            }
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
