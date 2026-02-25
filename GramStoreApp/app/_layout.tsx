import { Stack } from "expo-router";

export default function RootLayout() {

  return (

    <Stack>

      {/* Tabs */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/* Profile */}
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: "#2e7d32",
          },
          headerTintColor: "#fff",
        }}
      />

    </Stack>

  );

}