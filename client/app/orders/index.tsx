import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import type { Order } from "@/constants/types";
import { dummyOrders, formatDate } from "@/assets/assets";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setOrders(dummyOrders as any[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔧 Local helper for status badge styles
  const getOrderStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { backgroundColor: "#FEF3C7" }; // amber
      case "shipped":
        return { backgroundColor: "#DBEAFE" }; // blue
      case "delivered":
        return { backgroundColor: "#D1FAE5" }; // green
      case "cancelled":
        return { backgroundColor: "#FECACA" }; // red
      default:
        return { backgroundColor: "#E5E7EB" }; // gray
    }
  };

  const getOrderStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { color: "#92400E" };
      case "shipped":
        return { color: "#1E40AF" };
      case "delivered":
        return { color: "#047857" };
      case "cancelled":
        return { color: "#B91C1C" };
      default:
        return { color: "#374151" };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Header title="My Orders" showBack />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/orders/${item._id}`)}
            >
              <View style={styles.rowBetween}>
                <Text style={styles.orderNumber}>
                  Order #{item.orderNumber}
                </Text>
                <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
              </View>

              {/* Status Badges */}
              <View style={styles.badgesRow}>
                <View
                  style={[styles.badge, getOrderStatusStyle(item.orderStatus)]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      getOrderStatusTextColor(item.orderStatus),
                    ]}
                  >
                    {item.orderStatus}
                  </Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    item.paymentStatus === "paid"
                      ? styles.badgePaid
                      : styles.badgeUnpaid,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      item.paymentStatus === "paid"
                        ? styles.badgePaidText
                        : styles.badgeUnpaidText,
                    ]}
                  >
                    {item.paymentStatus}
                  </Text>
                </View>
              </View>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>
                  Payment Method:{" "}
                  <Text style={styles.paymentValue}>{item.paymentMethod}</Text>
                </Text>
              </View>

              {/* Product Images */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imagesRow}
              >
                {item.items.map((prod: any, idx) => {
                  const image = prod.product?.images?.[0];
                  return (
                    <View key={idx} style={styles.imageWrapper}>
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <Ionicons
                            name="image-outline"
                            size={20}
                            color={COLORS.secondary}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>

              <View style={styles.footerRow}>
                <Text style={styles.itemsCount}>
                  Items: {item.items.length}
                </Text>
                <Text style={styles.totalAmount}>
                  ${item.totalAmount.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.secondary,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderNumber: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  date: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  badgesRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  badgePaid: {
    backgroundColor: "#D1FAE5",
  },
  badgeUnpaid: {
    backgroundColor: "#F3F4F6",
  },
  badgePaidText: {
    color: "#047857",
  },
  badgeUnpaidText: {
    color: "#374151",
  },
  paymentRow: {
    marginBottom: 8,
  },
  paymentLabel: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  paymentValue: {
    color: COLORS.primary,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  imagesRow: {
    marginBottom: 12,
  },
  imageWrapper: {
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 4,
    backgroundColor: "#f9fafb",
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    marginTop: 8,
  },
  itemsCount: {
    color: COLORS.secondary,
  },
  totalAmount: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
