import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Welcome() {

  return (
    <View style={styles.container}>

      <View style={styles.top}>
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

  title: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },

  subtitle: {
    color: "white",
    marginTop: 10,
  },

  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: 200,
  },

  buttonText: {
    textAlign: "center",
    color: "#2e7d32",
    fontWeight: "bold",
  },

});