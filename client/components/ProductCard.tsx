import React from "react";
import { ProductCardProps } from "@/constants/types";
import { Link } from "expo-router";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useWishList } from "@/context/WishlistContext";

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishList();
  const isLiked = isInWishlist(product._id);

  return (
    <Link href={`/product/${product._id}`} asChild>
      <TouchableOpacity
        style={{
          width: "48%",
          marginBottom: 12,
          backgroundColor: "#fff",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <View style={{ height: 160, width: "100%" }}>
          <Image
            source={{ uri: product.images[0] }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* Heart Icon (Top Right) */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            style={{
              position: "absolute",
              top: 5,
              right: 8,
              backgroundColor: "#fff",
              borderRadius: 50,
              padding: 6,
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? COLORS.accent : COLORS.primary}
            />
          </TouchableOpacity>

          {/* Featured Badge (Bottom Left) */}
          {product.isFeatured && (
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                backgroundColor: "#000",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>
                Featured
              </Text>
            </View>
          )}
        </View>

        {/* Product info */}
        <View style={{ padding: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <Ionicons name="star" size={14} color={"#FFD700"} />
            <Text style={{ color: "#666666", fontSize: 14 }}>4.6</Text>
          </View>
          <Text
            style={{
              color: "#111111",
              fontWeight: "500",
              fontSize: 12,
              marginBottom: 3,
            }}
            numberOfLines={1}
          >
            {product.description}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Text style={{ color: "#111111", fontSize: 12, fontWeight: "600" }}>
              ${product.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
