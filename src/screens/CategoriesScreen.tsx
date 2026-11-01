import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { TodoBox } from "../components/TodoBox";
import { MOCK_CATEGORIES } from "../data/mockBooks";
// import { LoadingView } from "../components/LoadingView";
// import { ErrorView } from "../components/ErrorView";
// import { getCategories } from "../services/categoryService";
// import { getErrorMessage } from "../api/client";
import { TabScreenProps } from "../navigation/types";
import { Category } from "../types";
import { colors, radius } from "../theme";

// danh mục lấy từ API; nhấn → về Home kèm categoryId (Home tự lọc)
export function CategoriesScreen({ navigation }: TabScreenProps<"Categories">) {
  // TODO BT7.6b: state data / loading / error + load() gọi getCategories() trong useEffect — giống Home
  // TODO BT7.6c: loading → <LoadingView/>, error → <ErrorView onRetry={load}/>
  const data: Category[] = MOCK_CATEGORIES;
  void navigation;

  return (
    <View style={styles.container}>
      <Header title="🗂️ Danh mục" />
      <FlatList
        data={data}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        ListHeaderComponent={<TodoBox id="BT7.6b">Danh mục đang là dữ liệu GIẢ — nối API /categories.</TodoBox>}
        renderItem={({ item }) => (
          // TODO BT7.8c: onPress → navigation.navigate("Home", { categoryId: item.id })
          <Pressable style={styles.row} onPress={() => {}}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 16, borderRadius: radius.md, gap: 12 },
  emoji: { fontSize: 26 },
  name: { flex: 1, fontSize: 16, fontWeight: "700", color: colors.text },
  arrow: { fontSize: 22, color: colors.muted },
});
