import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import type { Order, Product } from "@/constants/types";
import { dummyOrders } from "@/assets/assets";

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    setOrder(dummyOrders.find((order) => order._id === id) as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={["top"]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.notFoundContainer} edges={["top"]}>
        <Text style={styles.notFoundText}>Order not found</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const ORDER_STEPS = [
    {
      title: "Order Placed",
      date: formatDate(order.createdAt),
      completed: true,
    },
    {
      title: "Processing",
      date: "",
      completed: ["processing", "shipped", "delivered"].includes(
        order.orderStatus,
      ),
    },
    {
      title: "Shipped",
      date: "",
      completed: ["shipped", "delivered"].includes(order.orderStatus),
    },
    {
      title: "Delivered",
      date: "",
      completed: order.orderStatus === "delivered",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Header title={`Order #${order.orderNumber}`} showBack />

      <ScrollView style={styles.scrollView}>
        {/* Order Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Status</Text>

          {ORDER_STEPS.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepIconContainer}>
                <View
                  style={[
                    styles.stepDot,
                    step.completed
                      ? styles.stepDotCompleted
                      : styles.stepDotIncomplete,
                  ]}
                />
                {index !== ORDER_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      step.completed
                        ? styles.stepLineCompleted
                        : styles.stepLineIncomplete,
                    ]}
                  />
                )}
              </View>
              <View style={styles.stepContent}>
                <Text
                  style={[
                    styles.stepTitle,
                    step.completed
                      ? styles.stepTitleCompleted
                      : styles.stepTitleIncomplete,
                  ]}
                >
                  {step.title}
                </Text>
                {step.date ? (
                  <Text style={styles.stepDate}>{step.date}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Products</Text>
          {order.items.map((item: any, index: number) => {
            const productData = item.product as Product;
            const image = productData?.images?.[0];

            return (
              <View
                key={index}
                style={[
                  styles.productItem,
                  index !== order.items.length - 1 &&
                    styles.productItemWithBorder,
                ]}
              >
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productSize}>Size: {item.size}</Text>
                  <View style={styles.productDetails}>
                    <Text style={styles.productPrice}>${item.price}</Text>
                    <Text style={styles.productQuantity}>
                      Qty: {item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Shipping Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shipping Details</Text>
          <View style={styles.shippingContainer}>
            <Ionicons
              name="location-outline"
              size={20}
              color={COLORS.secondary}
            />
            <Text style={styles.shippingText}>
              {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={[styles.card, { marginBottom: 32 }]}>
          <Text style={styles.cardTitle}>Payment Summary</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <Text
              style={[styles.paymentValue, { textTransform: "capitalize" }]}
            >
              {order.paymentMethod}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Status</Text>
            <Text
              style={[
                styles.paymentValue,
                { textTransform: "capitalize" },
                order.paymentStatus === "paid" && styles.paymentStatusPaid,
                order.paymentStatus === "failed" && styles.paymentStatusFailed,
                !["paid", "failed"].includes(order.paymentStatus) &&
                  styles.paymentStatusPending,
              ]}
            >
              {order.paymentStatus}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Subtotal</Text>
            <Text style={styles.paymentValue}>
              ${order.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Shipping</Text>
            <Text style={styles.paymentValue}>
              ${order.shippingCost.toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Tax</Text>
            <Text style={styles.paymentValue}>${order.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  // Order status styles
  stepContainer: {
    flexDirection: "row" as const,
    marginBottom: 16,
  },
  stepIconContainer: {
    alignItems: "center" as const,
    marginRight: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepDotCompleted: {
    backgroundColor: COLORS.primary,
  },
  stepDotIncomplete: {
    backgroundColor: "#D1D5DB",
  },
  stepLine: {
    width: 2,
    height: "100%",
    position: "absolute" as const,
    top: 12,
  },
  stepLineCompleted: {
    backgroundColor: COLORS.primary,
  },
  stepLineIncomplete: {
    backgroundColor: "#D1D5DB",
  },
  stepContent: {
    paddingBottom: 16,
  },
  stepTitle: {
    fontWeight: "bold" as const,
  },
  stepTitleCompleted: {
    color: COLORS.primary,
  },
  stepTitleIncomplete: {
    color: "#9CA3AF",
  },
  stepDate: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  // Product item styles
  productItem: {
    flexDirection: "row" as const,
  },
  productItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 16,
    marginBottom: 16,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center" as const,
  },
  productName: {
    color: COLORS.primary,
    fontWeight: "500" as const,
  },
  productSize: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  productDetails: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginTop: 8,
  },
  productPrice: {
    color: COLORS.primary,
    fontWeight: "bold" as const,
  },
  productQuantity: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  // Shipping details styles
  shippingContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  shippingText: {
    color: COLORS.secondary,
    marginLeft: 8,
    flex: 1,
  },
  // Payment summary styles
  paymentRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 8,
  },
  paymentLabel: {
    color: COLORS.secondary,
  },
  paymentValue: {
    color: COLORS.primary,
    fontWeight: "500" as const,
  },
  paymentStatusPaid: {
    color: "#16A34A",
  },
  paymentStatusFailed: {
    color: "#DC2626",
  },
  paymentStatusPending: {
    color: "#F97316",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  totalText: {
    color: COLORS.primary,
    fontWeight: "bold" as const,
    fontSize: 18,
  },
});
