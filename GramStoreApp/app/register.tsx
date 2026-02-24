import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";

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

      if (data.success) {

        Alert.alert(
          "Success",
          "Registered successfully",
          [
            {
              text: "Login",
              onPress: () => router.replace("/login"),
            },
          ]
        );

      } else {

        Alert.alert(
          "User already exists",
          "Please login instead",
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/login"),
            },
          ]
        );

      }

    } catch (error) {

      Alert.alert("Error", "Server not reachable");

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Phone"
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

      {/* Already existing login option */}
      <TouchableOpacity
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.loginLink}>
          Already registered? Login here
        </Text>
      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },

  loginLink: {
    marginTop: 15,
    textAlign: "center",
    color: "#2e7d32",
    fontSize: 15,
  },

});