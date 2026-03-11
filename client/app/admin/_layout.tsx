// app/admin/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { dummyUser } from "@/assets/assets";

export default function AdminLayout() {
  const { user } = { user: dummyUser };
  const isLoaded = true;
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== "admin")) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user || user.publicMetadata?.role !== "admin") return null;

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            style={styles.headerRight}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.primary} />
            <Text style={styles.headerRightText}>Exit</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  headerRight: {
    marginRight: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerRightText: {
    marginLeft: 4,
    color: COLORS.primary,
    fontWeight: "500",
  },
});
