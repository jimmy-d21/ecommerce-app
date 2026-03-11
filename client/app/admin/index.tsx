// app/admin/index.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { COLORS, getStatusColor } from "@/constants";
import { dummyAdminStats } from "@/assets/assets";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const fetchStats = async () => {
    setStats(dummyAdminStats as any);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
          />
          <StatCard label="Total Orders" value={stats.totalOrders.toString()} />
          <StatCard label="Products" value={stats.totalProducts.toString()} />
          <StatCard label="Users" value={stats.totalUsers.toString()} />
        </View>
      </View>

      <View style={styles.recentOrdersSection}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {stats.recentOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recent orders</Text>
          </View>
        ) : (
          stats.recentOrders.map((order: any) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderTotalProducts}>
                    Total Products :{" "}
                    {order.items.reduce(
                      (acc: number, item: any) => acc + item.quantity,
                      0,
                    )}
                  </Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.orderStatus) },
                  ]}
                >
                  <Text style={styles.statusText}>{order.orderStatus}</Text>
                </View>
              </View>
              <View style={styles.itemsContainer}>
                {order.items.map((item: any) => (
                  <Text key={item._id} style={styles.itemText}>
                    {item.name} x {item.quantity}
                  </Text>
                ))}
              </View>

              <View style={styles.divider} />

              <View style={styles.orderFooter}>
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.avatarText}>
                      {(order.user?.name || "?").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.userName}>
                    {order.user?.name || "Unknown User"}
                  </Text>
                </View>
                <Text style={styles.orderTotal}>
                  ${order.totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

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
  overviewSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    width: "48%",
    marginBottom: 16,
    justifyContent: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recentOrdersSection: {
    marginBottom: 24,
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.secondary,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderTotalProducts: {
    fontWeight: "bold",
    color: COLORS.primary,
    fontSize: 16,
  },
  orderDate: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  itemsContainer: {
    paddingBottom: 8,
  },
  itemText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 12,
  },
  userName: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  orderTotal: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 18,
  },
});
