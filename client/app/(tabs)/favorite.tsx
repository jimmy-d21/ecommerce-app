import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useWishList } from "@/context/WishlistContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

export default function Favorite() {
  const { wishlist, loading } = useWishList();
  const router = useRouter();

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size={"large"} color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
      edges={["top"]}
    >
      <Header showMenu title="Wishlist" showCart />
      {wishlist.length > 0 ? (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <Text
            style={{ fontSize: 19, color: COLORS.secondary, marginBottom: 5 }}
          >
            Your wishlist is empty
          </Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text
              style={{ fontSize: 14, color: COLORS.primary, fontWeight: "800" }}
            >
              Start Shopping
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}
