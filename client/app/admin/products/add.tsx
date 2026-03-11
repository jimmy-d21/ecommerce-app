// app/admin/products/add.tsx
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { CATEGORIES } from "@/constants";

export default function AddProduct() {
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Men");
  const [sizes, setSizes] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  // PICK MULTIPLE IMAGES (MAX 5)
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages(uris.slice(0, 5));
    }
  };

  // Add Product
  const handleSubmit = async () => {
    if (!name || !price || !category || sizes.length < 1) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all required fields",
      });
      return;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* NAME */}
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Wireless Headphones"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        {/* PRICE */}
        <Text style={styles.label}>Price ($) *</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.categorySelector}
        >
          <Text style={styles.categoryText}>{category}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.secondary} />
        </TouchableOpacity>

        {/* CATEGORY MODAL */}
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

        {/* STOCK */}
        <Text style={styles.label}>Stock Level</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={stock}
          onChangeText={setStock}
        />

        {/* SIZES */}
        <Text style={styles.label}>Sizes (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. S, M, L, XL"
          placeholderTextColor="#9CA3AF"
          value={sizes}
          onChangeText={setSizes}
        />

        {/* IMAGE PICKER */}
        <Text style={styles.label}>Product Images (max 5)</Text>

        <TouchableOpacity
          onPress={pickImages}
          style={styles.imagePickerContainer}
        >
          {images.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.previewImage} />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons
                name="cloud-upload-outline"
                size={32}
                color={COLORS.secondary}
              />
              <Text style={styles.uploadText}>Tap to upload images</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* DESCRIPTION */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter product description..."
          placeholderTextColor="#9CA3AF"
        />

        {/* FEATURED */}
        <View style={styles.featuredContainer}>
          <Text style={styles.featuredLabel}>Featured Product</Text>
          <Switch
            value={isFeatured}
            onValueChange={setIsFeatured}
            trackColor={{ false: "#eee", true: COLORS.primary }}
          />
        </View>

        {/* SUBMIT */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Create Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
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
  imagePickerContainer: {
    marginBottom: 16,
  },
  previewImage: {
    width: 128,
    height: 128,
    borderRadius: 8,
    marginRight: 8,
  },
  uploadPlaceholder: {
    width: "100%",
    height: 128,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
  },
  uploadText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 8,
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
    fontWeight: "bold",
    fontSize: 18,
  },
});
