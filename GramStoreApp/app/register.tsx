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
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_URL = "http://localhost:5000";

export default function Register() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {

    if (!name || !phone || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          password,
        }),
      });

      const data = await res.json();

      console.log("REGISTER RESPONSE:", data);

      if (data.success) {

        Alert.alert("Success", "Registered successfully");

        // redirect after short delay
        setTimeout(() => {
          router.replace("/login");
        }, 300);

      } else {

        Alert.alert("User already exists");

        setTimeout(() => {
          router.replace("/login");
        }, 300);

      }

    } catch (error) {

      console.log(error);
      Alert.alert("Error", "Server not reachable");

    }

  };

  return (

    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="storefront"
            size={60}
            color="#2e7d32"
          />
        </View>

        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Register your store to continue
        </Text>

        <View style={styles.card}>

          <TextInput
            placeholder="Store Owner Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={registerUser}
          >
            <Text style={styles.buttonText}>
              Register
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.loginLink}>
            Already have an account? Login
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
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  loginLink: {
    marginTop: 20,
    color: "white",
    fontSize: 15,
  },

});