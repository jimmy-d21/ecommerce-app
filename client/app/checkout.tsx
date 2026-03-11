import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Address } from "@/constants/types";
import { dummyAddress } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

export default function Checkout() {
  const { cartTotal } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");

  const shipping = 2.0;
  const tax = 0;

  const totalAmount = cartTotal + shipping + tax;

  const fetchAddress = async () => {
    const addrList = dummyAddress;
    if (addrList.length > 0) {
      const address = addrList.find((a: any) => a.isDefault) || addrList[0];
      setSelectedAddress(address as Address);
    }
    setPageLoading(false);
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <Header showBack title="Checkout" />

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 20 }}>
              Shipping Address
            </Text>
            {/* Address Display */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 18,
                flexDirection: "column",
                gap: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontWeight: "800",
                    color: COLORS.primary,
                    fontSize: 16,
                  }}
                >
                  {selectedAddress?.type}
                </Text>
                <TouchableOpacity onPress={() => router.push("/addresses")}>
                  <Text style={{ color: COLORS.accent, fontWeight: "600" }}>
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: "90%" }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.secondary,
                    fontWeight: "500",
                  }}
                >
                  {selectedAddress?.street}, {selectedAddress?.city}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.secondary,
                    fontWeight: "500",
                  }}
                >
                  {selectedAddress?.city}, {selectedAddress?.zipCode}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.secondary,
                    fontWeight: "500",
                  }}
                >
                  {selectedAddress?.country}
                </Text>
              </View>
            </View>
          </View>
          {/* Payment Selections */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: "800", marginBottom: 20 }}>
              Payment Method
            </Text>
            <View style={{ flexDirection: "column", gap: 20 }}>
              {/* Cash Method */}
              <TouchableOpacity onPress={() => setPaymentMethod("cash")}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 15,
                    gap: 15,
                    borderWidth: 2,
                    borderColor:
                      paymentMethod === "cash" ? COLORS.primary : "transparent",
                  }}
                >
                  <Ionicons
                    name="cash-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "800",
                        fontSize: 16,
                        color: COLORS.primary,
                        marginBottom: 3,
                      }}
                    >
                      Cash on Delivery
                    </Text>
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 12,
                        color: COLORS.secondary,
                      }}
                    >
                      Pay when you receive the order
                    </Text>
                  </View>
                  {paymentMethod === "cash" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </View>
              </TouchableOpacity>
              {/* Stripe Method */}
              <TouchableOpacity onPress={() => setPaymentMethod("stripe")}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 15,
                    gap: 15,
                    borderWidth: 2,
                    borderColor:
                      paymentMethod === "stripe"
                        ? COLORS.primary
                        : "transparent",
                  }}
                >
                  <Ionicons
                    name="card-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "800",
                        fontSize: 16,
                        color: COLORS.primary,
                        marginBottom: 3,
                      }}
                    >
                      Pay with Card
                    </Text>
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 12,
                        color: COLORS.secondary,
                      }}
                    >
                      Credit or Debit Card
                    </Text>
                  </View>
                  {paymentMethod === "stripe" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            flexDirection: "column",
          }}
        >
          <Text
            style={{
              fontSize: 19,
              fontWeight: "800",
              color: COLORS.primary,
              marginBottom: 15,
            }}
          >
            Order Summary
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ color: COLORS.secondary, fontSize: 15 }}>
              Subtotal
            </Text>
            <Text
              style={{ color: COLORS.primary, fontSize: 16, fontWeight: "800" }}
            >
              $132.00
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ color: COLORS.secondary, fontSize: 15 }}>
              Shipping
            </Text>
            <Text
              style={{ color: COLORS.primary, fontSize: 16, fontWeight: "800" }}
            >
              $2.00
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ color: COLORS.secondary, fontSize: 15 }}>Tax</Text>
            <Text
              style={{ color: COLORS.primary, fontSize: 16, fontWeight: "800" }}
            >
              $0.00
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 20,
                fontWeight: "800",
                marginTop: 10,
              }}
            >
              Total
            </Text>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 20,
                fontWeight: "800",
                marginTop: 10,
              }}
            >
              $134.00
            </Text>
          </View>
          <TouchableOpacity
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 15,
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              marginTop: 10,
            }}
            onPress={() => router.push("/")}
          >
            {!loading ? (
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                Place Order
              </Text>
            ) : (
              <ActivityIndicator color={"#fff"} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
