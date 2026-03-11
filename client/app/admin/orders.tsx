// app/admin/orders.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
} from "react-native";
import { COLORS, getStatusColor } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { dummyOrders, dummyUser } from "@/assets/assets";

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);

  // Status Modal State
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const STATUSES = [
    "placed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const fetchOrders = async () => {
    setOrders(
      dummyOrders.map((order: any) => ({
        ...order,
        user: dummyUser,
      })) as any,
    );
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const openStatusModal = (order: any) => {
    setSelectedOrder(order);
    setStatusModalVisible(true);
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(
        orders.map((order: any) =>
          order._id === selectedOrder._id
            ? { ...order, orderStatus: newStatus }
            : order,
        ) as any,
      );
      setStatusModalVisible(false);
      setUpdating(false);
    }, 500);
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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          orders.map((order: any) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order ID : #{order._id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.customerSection}>
                <Text style={styles.sectionLabel}>CUSTOMER</Text>
                <Text style={styles.customerName}>
                  {order.user?.name || "Unknown User"}
                </Text>
                <Text style={styles.customerEmail}>
                  {order.user?.email || "No email"}
                </Text>
                {!order.user && (
                  <Text style={styles.userId}>
                    ID: {order.user?._id || "N/A"}
                  </Text>
                )}
              </View>

              <View style={styles.addressSection}>
                <Text style={styles.sectionLabel}>SHIPPING ADDRESS</Text>
                <Text style={styles.addressText}>
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                </Text>
                <Text style={styles.addressText}>
                  {order.shippingAddress?.state},{" "}
                  {order.shippingAddress?.zipCode},{" "}
                  {order.shippingAddress?.country}
                </Text>
              </View>

              <View style={styles.itemsSection}>
                <Text style={styles.sectionLabel}>ITEMS</Text>
                {order.items.map((item: any) => (
                  <View key={item._id} style={styles.itemRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.quantity}x {item.product?.name || item.name}
                      {item.size && (
                        <Text style={styles.itemSize}>
                          {" "}
                          ({item.size || "-"})
                        </Text>
                      )}
                    </Text>
                    <Text style={styles.itemPrice}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.totalAmount}>
                  ${order.totalAmount.toFixed(2)}
                </Text>

                <TouchableOpacity
                  onPress={() => openStatusModal(order)}
                  style={[
                    styles.statusButton,
                    { backgroundColor: getStatusColor(order.orderStatus) },
                  ]}
                >
                  <Text style={styles.statusButtonText}>
                    {order.orderStatus}
                  </Text>
                  <Ionicons
                    name="pencil"
                    size={12}
                    color="black"
                    style={styles.statusButtonIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* STATUS MODAL */}
      <Modal visible={statusModalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Order Status</Text>
                <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.secondary} />
                </TouchableOpacity>
              </View>

              {updating ? (
                <View style={styles.updatingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.updatingText}>Updating status...</Text>
                </View>
              ) : (
                <FlatList
                  data={STATUSES}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.statusOption,
                        selectedOrder?.orderStatus === item &&
                          styles.statusOptionSelected,
                      ]}
                      onPress={() => updateStatus(item)}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          selectedOrder?.orderStatus === item &&
                            styles.statusOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {selectedOrder?.orderStatus === item && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  scrollView: {
    flex: 1,
    padding: 16,
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
  orderCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontWeight: "500",
    fontSize: 14,
    color: "#9CA3AF",
  },
  orderDate: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  customerSection: {
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  customerName: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  customerEmail: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  userId: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  addressSection: {
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  addressText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  itemsSection: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemName: {
    color: COLORS.secondary,
    fontSize: 12,
    flex: 1,
  },
  itemSize: {
    color: "#9CA3AF",
  },
  itemPrice: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "bold",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  totalAmount: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 18,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusButtonIcon: {
    opacity: 0.5,
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
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  updatingContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  updatingText: {
    textAlign: "center",
    color: COLORS.secondary,
    marginTop: 8,
  },
  statusOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  statusOptionSelected: {
    backgroundColor: `${COLORS.primary}10`,
  },
  statusOptionText: {
    fontWeight: "500",
    color: COLORS.secondary,
    textTransform: "capitalize",
  },
  statusOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
});
