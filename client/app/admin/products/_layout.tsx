// app/admin/products/_layout.tsx
import { Stack } from "expo-router";
import { COLORS } from "@/constants";
import { StyleSheet } from "react-native";

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: COLORS.primary,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Manage Products", headerShown: false }}
      />
      <Stack.Screen name="add" options={{ title: "Add Product" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Product" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontWeight: "bold",
  },
});
