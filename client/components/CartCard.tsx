import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { CartItemProps } from "@/constants/types";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useCart } from "@/context/CartContext";

export default function CartCard({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { removeFromCart, updateQuantity } = useCart();

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      updateQuantity(item.id, newQty, item.size);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    updateQuantity(item.id, newQty, item.size);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginTop: 15,
      }}
    >
      {/* Cart Image */}
      <Image
        source={{ uri: item.product.images[0] }}
        style={{ width: 80, height: 90, borderRadius: 8 }}
        resizeMode="cover"
      />

      {/* Cart info */}
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
        >
          <View style={{ flex: 1, gap: 3 }}>
            <Text
              style={{ fontSize: 14, fontWeight: "600", color: COLORS.primary }}
            >
              {item.product.name}
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.secondary }}>
              Size: {item.size}
            </Text>
          </View>
          <TouchableOpacity onPress={() => removeFromCart(item.id, item.size)}>
            <Entypo name="circle-with-cross" size={21} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{ fontSize: 15, fontWeight: "600", color: COLORS.primary }}
          >
            ${(quantity * item.product.price).toFixed(2)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 20,
              backgroundColor: "#E5E7EB",
            }}
          >
            <TouchableOpacity onPress={handleDecrease}>
              <AntDesign name="minus" size={15} color="black" />
            </TouchableOpacity>
            <Text
              style={{ fontWeight: "600", color: COLORS.primary, fontSize: 14 }}
            >
              {quantity}
            </Text>
            <TouchableOpacity onPress={handleIncrease}>
              <AntDesign name="plus" size={15} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
