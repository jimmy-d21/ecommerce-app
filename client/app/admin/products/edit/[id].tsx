// app/admin/products/edit/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Image,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { COLORS, CATEGORIES } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { dummyProducts } from "@/assets/assets";

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Image State
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product: any = dummyProducts.find((p) => p._id === id);
        setName(product.name);
        setDescription(product.description || "");
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setCategory(
          typeof product.category === "object"
            ? product.category.name
            : product.category,
        );
        setIsFeatured(product.isFeatured);

        if (product.sizes)
          setSizes(
            Array.isArray(product.sizes)
              ? product.sizes.join(", ")
              : product.sizes,
          );

        if (product.images && Array.isArray(product.images)) {
          setExistingImages(product.images);
        } else if (product.images) {
          setExistingImages([product.images]);
        }
      } catch (error: any) {
        console.error("Failed to fetch product:", error);
        Toast.show({
          type: "error",
          text1: "Failed to Fetch Product",
          text2: error.response?.data?.message || "Something went wrong",
        });
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - (existingImages.length + newImages.length),
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setNewImages([...newImages, ...uris]);
    }
  };

  const removeExistingImage = (index: number) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (index: number) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handleSubmit = async () => {
    if (!name || !price || sizes.length < 1) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all required fields",
      });
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("isFeatured", String(isFeatured));
      formData.append("sizes", sizes);

      // Append existing images
      existingImages.forEach((img) => {
        formData.append("existingImages", img);
      });

      // Append new images
      for (const [i, uri] of newImages.entries()) {
        const filename = `new-image-${i}.jpg`;
        if (Platform.OS === "web") {
          const blob = await (await fetch(uri)).blob();
          formData.append(
            "images",
            new File([blob], filename, { type: "image/jpeg" }),
          );
        } else {
          formData.append("images", {
            uri,
            name: filename,
            type: "image/jpeg",
          } as any);
        }
      }
      router.back();
    } catch (error: any) {
      console.error("Failed to update product:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Update Product",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* Product Name */}
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
          placeholderTextColor="#9CA3AF"
        />

        {/* Price */}
        <Text style={styles.label}>Price ($) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
          placeholder="0.00"
          placeholderTextColor="#9CA3AF"
        />

        {/* Stock Level */}
        <Text style={styles.label}>Stock Level</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={stock}
          onChangeText={setStock}
          placeholder="0"
          placeholderTextColor="#9CA3AF"
        />

        {/* Sizes */}
        <Text style={styles.label}>Sizes (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. S, M, L"
          placeholderTextColor="#9CA3AF"
          value={sizes}
          onChangeText={setSizes}
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.categorySelector}
        >
          <Text style={styles.categoryText}>
            {category || "Select Category"}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.secondary} />
        </TouchableOpacity>

        {/* Category Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <FlatList
                  data={CATEGORIES}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.categoryItem,
                        category === item.name && styles.categoryItemSelected,
                      ]}
                      onPress={() => {
                        setCategory(item.name);
                        setModalVisible(false);
                      }}
                    >
                      <View style={styles.categoryItemContent}>
                        <Text
                          style={[
                            styles.categoryItemText,
                            category === item.name &&
                              styles.categoryItemTextSelected,
                          ]}
                        >
                          {item.name}
                        </Text>
                        {category === item.name && (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={COLORS.primary}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Images */}
        <Text style={styles.label}>Images</Text>
        <View style={styles.imageContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {existingImages.map((uri, index) => (
              <View key={`existing-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.existingImage} />
                <TouchableOpacity
                  onPress={() => removeExistingImage(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {newImages.map((uri, index) => (
              <View key={`new-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.newImage} />
                <TouchableOpacity
                  onPress={() => removeNewImage(index)}
                  style={[styles.removeButton, styles.newImageRemoveButton]}
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {existingImages.length + newImages.length < 5 && (
              <TouchableOpacity
                onPress={pickImages}
                style={styles.addImageButton}
              >
                <Ionicons name="add" size={24} color={COLORS.secondary} />
                <Text style={styles.addImageText}>Add</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter product description..."
          placeholderTextColor="#9CA3AF"
        />

        {/* Featured Toggle */}
        <View style={styles.featuredContainer}>
          <Text style={styles.featuredLabel}>Featured Product</Text>
          <Switch
            value={isFeatured}
            onValueChange={setIsFeatured}
            trackColor={{ false: "#eee", true: COLORS.primary }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Update Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 80,
  },
  label: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: COLORS.primary,
    fontSize: 14,
  },
  categorySelector: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: COLORS.primary,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryItemSelected: {
    backgroundColor: `${COLORS.primary}08`,
  },
  categoryItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryItemText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  categoryItemTextSelected: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  imageContainer: {
    marginBottom: 16,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 8,
  },
  existingImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  newImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 4,
  },
  newImageRemoveButton: {
    backgroundColor: COLORS.primary,
  },
  addImageButton: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
  },
  addImageText: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },
  textArea: {
    height: 96,
    marginBottom: 24,
  },
  featuredContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  featuredLabel: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 18,
  },
});
