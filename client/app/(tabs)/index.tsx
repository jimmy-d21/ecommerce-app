import { BANNERS, dummyProducts } from "@/assets/assets";
import CategorieItem from "@/components/CategorieItem";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/constants";
import { Product } from "@/constants/types";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const bannerScrollRef = useRef<ScrollView>(null);

  const categories = [{ id: "all", name: "All", icon: "grid" }, ...CATEGORIES];

  const fetchProducts = async () => {
    setProducts(dummyProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-scroll banners every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        activeBannerIndex === BANNERS.length - 1 ? 0 : activeBannerIndex + 1;
      setActiveBannerIndex(nextIndex);

      bannerScrollRef.current?.scrollTo({
        x: nextIndex * (width - 32),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBannerIndex]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["top"]}
    >
      <Header title="Forever" showMenu showCart showLogo />

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Slider */}
        <ScrollView
          ref={bannerScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const slide = Math.ceil(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width,
            );
            if (slide !== activeBannerIndex) {
              setActiveBannerIndex(slide);
            }
          }}
          scrollEventThrottle={16}
        >
          {BANNERS.map((banner) => (
            <View
              key={banner.id}
              style={{
                width: width - 32,
                height: 180,
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 4,
                position: "relative",
              }}
            >
              <Image
                source={{ uri: banner.image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />

              {/* Overlay Text */}
              <View
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  zIndex: 10,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  {banner.title}
                </Text>
                <Text
                  style={{ color: "white", fontSize: 14, fontWeight: "500" }}
                >
                  {banner.subtitle}
                </Text>
                <TouchableOpacity
                  style={{
                    marginTop: 8,
                    backgroundColor: "white",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      color: "#000000",
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  >
                    Get Now
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}
              />
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 12,
            marginBottom: 12,
            gap: 6,
          }}
        >
          {BANNERS.map((_, index) => (
            <View
              key={index}
              style={{
                height: 8,
                borderRadius: 4,
                width: index === activeBannerIndex ? 24 : 8,
                backgroundColor:
                  index === activeBannerIndex ? "#000000" : "#D1D5DB",
              }}
            />
          ))}
        </View>

        {/* Categories */}
        <View style={{ flexDirection: "column", gap: 10, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Categories</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {categories.map((cat: any) => (
              <CategorieItem
                key={cat.id}
                item={cat}
                isSelected={false}
                onPress={() => {
                  router.push({
                    pathname: "/shop",
                    params: { category: cat.id === "all" ? "" : cat.name },
                  });
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Popular Products */}
        <View
          style={{
            flexDirection: "column",
            marginTop: 10,
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>Popular</Text>
            <TouchableOpacity onPress={() => router.push(`/shop`)}>
              <Text style={{ color: "gray" }}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size={"large"} />
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </View>
          )}
        </View>

        {/* Newsletter */}
        <View
          style={{
            marginTop: 40,
            marginBottom: 20,
            padding: 20,
            backgroundColor: "#F9FAFB",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Join the Revolution
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#4B5563",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Subscribe to our newsletter and get 10% off your first purchase.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#000",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Subscribe Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
