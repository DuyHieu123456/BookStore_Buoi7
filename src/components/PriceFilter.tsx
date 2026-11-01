import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { PRICE_RANGES, PriceRange } from "../utils/filters";
import { colors, radius } from "../theme";

interface Props {
  value: PriceRange;
  onChange: (v: PriceRange) => void;
}

// THỬ THÁCH BT7.C2: 3 nút lọc khoảng giá (bấm lần nữa vào nút đang chọn để bỏ chọn)
export function PriceFilter({ value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {PRICE_RANGES.map((r) => {
        const active = value === r.key;
        return (
          <Pressable
            key={r.key}
            onPress={() => onChange(active ? null : r.key)}
            style={[styles.btn, active && styles.btnActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{r.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 12, paddingBottom: 10, gap: 8 },
  btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.cyan },
  btnActive: { backgroundColor: colors.cyan, borderColor: colors.cyan },
  text: { color: colors.text, fontWeight: "600" },
  textActive: { color: "#fff", fontWeight: "800" },
});
