import { Image, TouchableOpacity, View, Text } from "react-native";
import React from "react";
import { HeaderProps } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";

export default function Header({
  title,
  showBack,
  showSearch,
  showCart,
  showMenu,
  showLogo,
}: HeaderProps) {
  const router = useRouter();
  const { itemCount } = useCart();
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white">
      {/* Left Side */}
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {showMenu && (
          <TouchableOpacity className="mr-3">
            <Ionicons name="menu-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {showLogo ? (
          <View className="flex-1">
            <Image
              source={require("@/assets/logo.png")}
              style={{ width: "100%", height: 24 }}
              resizeMode="contain"
            />
          </View>
        ) : (
          title && (
            <Text className="text-xl font-bold text-primary text-center flex-1 mr-8">
              {title}
            </Text>
          )
        )}

        {!title && !showSearch && <View className="flex-2" />}
      </View>
      {/* Right Side */}
      <View className="flex-row items-center gap-4">
        {showSearch && (
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
            <View style={{ width: 28, height: 28 }}>
              <Ionicons name="bag-outline" size={24} color={COLORS.primary} />
              {itemCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: COLORS.accent,
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
        )}
      </View>
    </View>
  );
}
