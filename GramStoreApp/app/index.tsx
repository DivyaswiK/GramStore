import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Welcome() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>

        <View style={styles.top}>

          {/* Shop Logo */}
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons
              name="store"
              size={65}
              color="#2e7d32"
            />
          </View>

          <Text style={styles.title}>GramStore</Text>

          <Text style={styles.subtitle}>
            Smart Inventory for Kirana Stores
          </Text>

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>
            Get Started
          </Text>
        </TouchableOpacity>

      </View>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
  },

  top: {
    alignItems: "center",
    marginBottom: 50,
  },

  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  title: {
    fontSize: 42,
    color: "white",
    fontWeight: "bold",
  },

  subtitle: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: 220,
  },

  buttonText: {
    textAlign: "center",
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: 18,
  },

});