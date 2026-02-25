import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const PRODUCTS_API = "http://localhost:5000/products";
const SELL_API = "http://localhost:5000/sell";

type Product = {
  _id: string;
  name: string;
  stock: number;
  sellingPrice: number;
};

export default function SellScreen() {

  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [quantity, setQuantity] = useState("");

  const [userId, setUserId] = useState<string | null>(null);

  // Load user and products
  useEffect(() => {

    loadUserAndProducts();

  }, []);

  const loadUserAndProducts = async () => {

    try {

      const id = await AsyncStorage.getItem("userId");

      if (!id) {

        Alert.alert("Error", "User not logged in");

        return;

      }

      setUserId(id);

      fetchProducts(id);

    } catch {

      Alert.alert("Error", "Failed to load user");

    }

  };

  // Fetch products for logged user
  const fetchProducts = async (id: string) => {

    try {

      const res = await fetch(`${PRODUCTS_API}/${id}`);

      const data = await res.json();

      setProducts(data);

    } catch {

      Alert.alert("Error", "Failed to fetch products");

    }

  };

  // Sell item
  const sellItem = async () => {

    if (!selectedProduct) {

      Alert.alert("Select a product");

      return;

    }

    if (!quantity || Number(quantity) <= 0) {

      Alert.alert("Enter valid quantity");

      return;

    }

    if (Number(quantity) > selectedProduct.stock) {

      Alert.alert("Not enough stock");

      return;

    }

    try {

      const res = await fetch(SELL_API, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          userId: userId,

          productId: selectedProduct._id,

          quantity: Number(quantity),

        }),

      });

      const data = await res.json();

      if (data.success) {

        Alert.alert("Success", "Item sold successfully");

        setQuantity("");

        setSelectedProduct(null);

        fetchProducts(userId!);

      } else {

        Alert.alert("Error", data.message || "Sell failed");

      }

    } catch {

      Alert.alert("Error", "Server error");

    }

  };

  // Render product
  const renderProduct = ({ item }: { item: Product }) => {

    const isSelected = selectedProduct?._id === item._id;

    return (

      <TouchableOpacity
        style={[
          styles.productCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => setSelectedProduct(item)}
      >

        <Text style={styles.productName}>
          {item.name}
        </Text>

        <Text>
          Stock: {item.stock}
        </Text>

        <Text>
          Price: ₹{item.sellingPrice}
        </Text>

      </TouchableOpacity>

    );

  };

  const total =
    selectedProduct && quantity
      ? Number(quantity) * selectedProduct.sellingPrice
      : 0;

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Select Product
      </Text>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      {selectedProduct && (

        <Text style={styles.total}>
          Total Amount: ₹{total}
        </Text>

      )}

      <TouchableOpacity
        style={styles.sellButton}
        onPress={sellItem}
      >

        <Text style={styles.sellText}>
          Sell Item
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  productCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  selectedCard: {
    backgroundColor: "#c8e6c9",
  },

  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  total: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },

  sellButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },

  sellText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

});