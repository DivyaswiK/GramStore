import  { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

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

      body: JSON.stringify({
        name,
        password,
      }),

    });

    const data = await res.json();
    console.log(data)
    if (data.success) {
      AsyncStorage.setItem("userName",data.user.name)
      router.replace("/(tabs)/dashboard");

    } else {

      Alert.alert("Error", "Invalid credentials");

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Login
      </Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Password"
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

      <TouchableOpacity
        onPress={() => router.push("/register")}
      >
        <Text style={styles.link}>
          New user? Register
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
    fontSize: 30,
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
  },

  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#2e7d32",
  },

});