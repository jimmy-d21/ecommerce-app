import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CategoryItemProps } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";

export default function CategorieItem({
  item,
  isSelected,
  onPress,
}: CategoryItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ alignItems: "center", marginRight: 16 }}
    >
      {/* Circle background */}
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isSelected ? COLORS.primary : "#f3f4f6",
        }}
      >
        <Ionicons
          name={item.icon as any}
          size={28}
          color={isSelected ? "#FFF" : COLORS.primary}
        />
      </View>

      {/* Label */}
      <Text
        style={{
          fontSize: 12,
          fontWeight: "500",
          color: isSelected ? COLORS.primary : "#374151",
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}
