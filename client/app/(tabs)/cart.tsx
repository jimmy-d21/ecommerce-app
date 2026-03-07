import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import CartCard from "@/components/CartCard";

export default function Cart() {
  const { cartItems, cartTotal } = useCart();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              paddingHorizontal: 15,
            }}
          >
            {cartItems.map((item) => (
              <CartCard key={item.id} item={item} />
            ))}
          </ScrollView>
          <View>
            <Text>Cart Total</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
