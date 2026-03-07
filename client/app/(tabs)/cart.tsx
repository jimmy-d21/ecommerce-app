import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import CartCard from "@/components/CartCard";

export default function Cart() {
  const { cartItems, cartTotal } = useCart();
  const shippingFee = 2;
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <Header title="My Cart" showBack />

      {cartItems.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: 19, color: COLORS.secondary, marginBottom: 5 }}
          >
            Your cart is empty
          </Text>
          <Text
            style={{ fontSize: 14, color: COLORS.primary, fontWeight: "800" }}
          >
            Start Shopping
          </Text>
        </View>
      ) : (
        <>
          {/* Cart Item Lists */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, paddingHorizontal: 15 }}
            contentContainerStyle={{ paddingVertical: 15, gap: 10 }}
          >
            {cartItems.map((item) => (
              <CartCard key={item.id} item={item} />
            ))}
          </ScrollView>

          {/* Cart Totals */}
          <View
            style={{
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              backgroundColor: "#fff",
              paddingHorizontal: 20,
              paddingVertical: 25,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            {/* SubTotal & Shipping Fee */}
            <View style={{ flexDirection: "column", gap: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 15, color: COLORS.secondary }}>
                  Subtotal
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: COLORS.primary,
                    fontWeight: "700",
                  }}
                >
                  ${cartTotal.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 15, color: COLORS.secondary }}>
                  Shipping
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: COLORS.primary,
                    fontWeight: "700",
                  }}
                >
                  ${shippingFee.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: "#E5E7EB",
                marginVertical: 20,
              }}
            />

            {/* Total */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: COLORS.primary,
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: COLORS.primary,
                }}
              >
                ${(cartTotal + shippingFee).toFixed(2)}
              </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.primary,
                borderRadius: 25,
                paddingVertical: 16,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
