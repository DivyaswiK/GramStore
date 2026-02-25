import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_URL = "http://localhost:5000";

export default function Login() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {

    if (!name || !password) {
      Alert.alert("Error", "Enter name and password");
      return;
    }

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    if (data.success) {

      await AsyncStorage.setItem("userId", data.user._id);
      await AsyncStorage.setItem("userName", data.user.name);

      router.replace("/(tabs)/dashboard");

    } else {
      Alert.alert("Error", "Invalid credentials");
    }

  };

  return (

    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        {/* Logo */}
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="storefront"
            size={60}
            color="#2e7d32"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Login to continue
        </Text>

        {/* Card */}
        <View style={styles.card}>

          <TextInput
            placeholder="Enter Name"
            style={styles.input}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Enter Password"
            secureTextEntry
            style={styles.input}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={loginUser}
          >
            <Text style={styles.buttonText}>
              Login
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>
            New user? Register
          </Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  logoContainer: {
    backgroundColor: "white",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,

    elevation: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    color: "white",
    marginBottom: 30,
    fontSize: 16,
  },

  card: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 15,
    padding: 20,

    elevation: 5,
  },

  input: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  link: {
    marginTop: 20,
    color: "white",
    fontSize: 15,
  },

});