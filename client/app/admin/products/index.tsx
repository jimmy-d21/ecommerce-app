// app/admin/products/index.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { dummyProducts } from "@/assets/assets";

export default function AdminProducts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    setProducts(dummyProducts as any);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const performDelete = async (id: string) => {
    setProducts(products.filter((product: any) => product._id !== id) as any);
  };

  const deleteProduct = async (id: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => performDelete(id),
        },
      ],
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Total Products ({products.length})
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/admin/products/add")}
          style={styles.addButton}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        ) : (
          products.map((product: any) => (
            <View key={product._id} style={styles.productCard}>
              <Image
                source={{
                  uri:
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "https://via.placeholder.com/150",
                }}
                style={styles.productImage}
                resizeMode="cover"
              />

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.productDetail} numberOfLines={1}>
                  Category: {product.category || "Others"}
                </Text>
                <Text style={styles.productDetail} numberOfLines={1}>
                  Stock: {product.stock}
                </Text>
                <Text style={styles.productDetail} numberOfLines={1}>
                  Sizes: {product.sizes.join(", ")}
                </Text>
                <Text style={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/admin/products/edit/${product._id}`)
                  }
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={18} color="#333333" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteProduct(product._id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={18} color="#333333" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
    padding: 8,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    color: COLORS.secondary,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: 2,
  },
  productDetail: {
    color: COLORS.secondary,
    fontSize: 12,
    marginBottom: 2,
  },
  productPrice: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
  },
});
