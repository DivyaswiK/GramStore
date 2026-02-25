import { Tabs, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function TabsLayout() {

  return (

    <Tabs
      screenOptions={{

        headerStyle: {
          backgroundColor: "#2e7d32",
        },

        headerTintColor: "#fff",

        tabBarActiveTintColor: "#2e7d32",

        tabBarInactiveTintColor: "gray",

        headerRight: () => (

          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={{ marginRight: 15 }}
          >
            <MaterialCommunityIcons
              name="account-circle"
              size={28}
              color="white"
            />
          </TouchableOpacity>

        ),

      }}
    >

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="package-variant" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="grouporders"
        options={{
          title: "Group Orders",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="sell"
        options={{
          title: "Sell",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart-arrow-right" size={size} color={color} />
          ),
        }}
      />


      {/* Profile hidden from tab bar
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarButton: () => null,

        }}
      /> */}

    </Tabs>

    

  );

}