import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Product } from "@/constants/types";
import { dummyProducts } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const start = (pageNumber - 1) * 10;
      const end = start + 10;
      const paginatedData = dummyProducts.slice(start, end);
      if (pageNumber == 1) {
        setProducts(paginatedData);
      } else {
        setProducts((prev) => [...prev, ...paginatedData]);
      }

      setHasMore(end < dummyProducts.length);

      setPage(pageNumber);
    } catch (error) {
      console.error("Pagination error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      fetchProducts(page + 1);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
      edges={["top"]}
    >
      <Header showBack title="Shop" showCart />
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 3,
          marginHorizontal: 4,
          marginVertical: 2,
          padding: 5,
        }}
      >
        {/* Search Bar */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 4,
            borderColor: "#F3F4F6",
            backgroundColor: "#fff",
            padding: 8,
          }}
        >
          <Ionicons
            name="search"
            style={{ marginLeft: 4 }}
            size={20}
            color={COLORS.secondary}
          />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 10,
              color: COLORS.primary,
              paddingHorizontal: 4,
              paddingVertical: 3,
            }}
            placeholder="Search products..."
            returnKeyType="search"
            placeholderTextColor={COLORS.secondary}
          />
        </View>

        {/* Filter Icon */}
        <TouchableOpacity
          style={{
            backgroundColor: "#1F2937",
            padding: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
        >
          <Ionicons
            name="options-outline"
            style={{ marginLeft: 4 }}
            size={24}
            color={"#fff"}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <ProductCard product={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 4 }}>
                <ActivityIndicator size={"small"} color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 20,
                }}
              >
                <Text>No product found</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}
