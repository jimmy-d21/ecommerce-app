import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { dummyUser } from "@/assets/assets";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS, PROFILE_MENU } from "@/constants";

export default function Profile() {
  const { user } = { user: dummyUser }; // replace with actual user context
  const router = useRouter();

  const handleLogout = async () => {
    router.replace("/");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F7F7F7" }}
      edges={["top"]}
    >
      <Header title="Profile" />
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 15 }}
        contentContainerStyle={
          !user
            ? {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }
            : { paddingTop: 16 }
        }
      >
        {!user ? (
          // Guest User Screen
          <View
            style={{
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 20,
              paddingVertical: 40,
            }}
          >
            {/* Avatar Circle */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#E5E7EB",
                marginBottom: 16,
              }}
            >
              <Ionicons name="person" size={40} color={COLORS.secondary} />
            </View>

            {/* Headline */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.primary,
                marginBottom: 6,
              }}
            >
              Guest User
            </Text>

            {/* Subtext */}
            <Text
              style={{
                fontSize: 14,
                color: COLORS.secondary,
                textAlign: "center",
                marginBottom: 20,
                paddingHorizontal: 10,
              }}
            >
              Log in to view your profile, orders, and addresses
            </Text>

            {/* Button */}
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 15,
                paddingHorizontal: 40,
                borderRadius: 25,
              }}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Login / Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Profile Info */}
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Image
                source={{ uri: user.imageUrl }}
                style={{
                  width: 80,
                  height: 80,
                  borderWidth: 2,
                  borderColor: "#fff",
                  borderRadius: 40,
                  marginBottom: 8,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: COLORS.primary,
                }}
              >
                {`${user.firstName} ${user.lastName}`}
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.secondary }}>
                {user.emailAddresses[0].emailAddress}
              </Text>

              {/* Admin Panel Button if user is admin */}
              {user.publicMetadata?.role === "admin" && (
                <TouchableOpacity
                  onPress={() => router.push("/admin")}
                  style={{
                    marginTop: 8,
                    backgroundColor: COLORS.primary,
                    paddingVertical: 8,
                    paddingHorizontal: 24,
                    borderRadius: 50,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Admin Panel
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Menu */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                borderColor: "rgba(243, 244, 246, 0.75)",
                padding: 20,
                marginBottom: 16,
              }}
            >
              {PROFILE_MENU.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(item.route as any)}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth:
                      index !== PROFILE_MENU.length - 1 ? 0.5 : 0,
                    borderBottomColor: "#E5E7EB",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#F7F7F7",
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={COLORS.primary}
                      />
                    </View>
                    <Text
                      style={{ flex: 1, color: COLORS.primary, fontSize: 14 }}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={COLORS.secondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ color: COLORS.accent, fontWeight: "bold" }}>
                Logout
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
