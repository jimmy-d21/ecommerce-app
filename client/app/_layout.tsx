import { Stack } from "expo-router";

import "@/global.css";
import { WishListProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <WishListProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </WishListProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
