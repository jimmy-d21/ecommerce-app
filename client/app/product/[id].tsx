import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/constants/types";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishlistContext";
import { dummyProducts } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, cartItems, itemCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishList();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const scrollRef = useRef<ScrollView>(null);

  const fetchProduct = async () => {
    const found = dummyProducts.find((p) => p._id === id);
    setProduct(found ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        edges={["top", "bottom"]}
      >
        <ActivityIndicator size={"large"} color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        edges={["top", "bottom"]}
      >
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  const isLiked = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      Toast.show({
        type: "error",
        text1: "No Size Selected",
        text2: "Please select a size",
      });
      return;
    }
    addToCart(product, selectedSize);
    setSelectedSize(null);
    Toast.show({
      type: "success",
      text1: "Add item successfully!",
      text2: "Thank you for buying our product.",
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "bottom"]}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image Carousel */}
        <View
          style={{
            position: "relative",
            height: 450,
            backgroundColor: "#f3f4f6",
          }}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const slide = Math.ceil(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              setActiveImageIndex(slide);
            }}
          >
            {product.images?.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width: width, height: 450 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>

        {/* Thumbnails */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10, paddingHorizontal: 15 }}
        >
          {product.images.length > 1 &&
            product.images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setActiveImageIndex(index);
                  scrollRef.current?.scrollTo({
                    x: index * width,
                    animated: true,
                  });
                }}
              >
                <Image
                  source={{ uri: img }}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: 8,
                    marginRight: 10,
                  }}
                />
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Header Actions */}
        <View
          style={{
            position: "absolute",
            top: 40,
            left: 20,
            right: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            style={{
              backgroundColor: "#fff",
              borderRadius: 50,
              padding: 8,
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? COLORS.accent : COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Pagination Dots */}
        {product.images.length > 1 && (
          <View
            style={{
              position: "absolute",
              top: 410,
              left: (width - 24 * product.images.length) / 2,
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {product.images.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 8,
                  borderRadius: 4,
                  width: index === activeImageIndex ? 24 : 8,
                  backgroundColor:
                    index === activeImageIndex ? "#000" : "#D1D5DB",
                }}
              />
            ))}
          </View>
        )}

        {/* Product Info */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          {/* Title & Rating */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 24, width: 240, fontWeight: "600" }}>
              {product.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: "#f3f4f6",
              }}
            >
              <Ionicons name="star" color={"#FFD700"} size={14} />
              <Text style={{ fontWeight: "600" }}>
                4.6{" "}
                <Text style={{ fontWeight: "300", color: "#1f2937" }}>
                  (85)
                </Text>
              </Text>
            </View>
          </View>

          {/* Price */}
          <Text style={{ marginTop: 5, fontWeight: "600", fontSize: 19 }}>
            ${product.price.toFixed(2)}
          </Text>

          {/* Size Options */}
          <View
            style={{ flexDirection: "column", gap: 10, paddingVertical: 20 }}
          >
            <Text style={{ color: "#000", fontSize: 17, fontWeight: "800" }}>
              Size
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {product.sizes?.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedSize(size)}
                >
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: selectedSize === size ? "#000" : "#fff",
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      borderRadius: 50,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedSize === size ? "#fff" : "#000",
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      {size}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Description */}
          <View
            style={{
              flexDirection: "column",
              gap: 10,
              paddingVertical: 10,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "#000", fontSize: 17, fontWeight: "800" }}>
              Description
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 20, color: "#4b5563" }}>
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Actions */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 10,
          right: 10,
          padding: 20,
          borderTopColor: "#d1d5db",
          borderTopWidth: 1,
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          onPress={handleAddToCart}
          style={{
            backgroundColor: "#000",
            paddingVertical: 15,
            borderRadius: 50,
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Ionicons name="bag-outline" size={18} color={"#fff"} />
            <Text style={{ fontSize: 17, color: "#fff", fontWeight: "600" }}>
              Add to Cart
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
          <View style={{ width: 28, height: 28 }}>
            <Ionicons name="cart-outline" size={28} color={COLORS.primary} />
            {itemCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: -7,
                  top: -7,
                  minWidth: 20,
                  height: 20,
                  borderRadius: 50,
                  backgroundColor: "#000",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 2,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
                >
                  {itemCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
