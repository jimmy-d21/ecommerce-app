// context/WishListContext.tsx
import { dummyWishlist } from "@/assets/assets";
import { Product, WishlistContextType } from "@/constants/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const WishListContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishListProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial wishlist (dummy data for now)
  const fetchWishList = async () => {
    setLoading(true);
    setWishlist(dummyWishlist);
    setLoading(false);
  };

  // Toggle product in wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      }
      return [...prev, product];
    });
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p._id === productId);
  };

  useEffect(() => {
    fetchWishList();
  }, []);

  const values: WishlistContextType = {
    wishlist,
    toggleWishlist,
    isInWishlist,
    loading,
  };

  return (
    <WishListContext.Provider value={values}>
      {children}
    </WishListContext.Provider>
  );
};

export const useWishList = () => {
  const context = useContext(WishListContext);
  if (context === undefined) {
    throw new Error("useWishList must be used within a WishListProvider");
  }
  return context;
};
