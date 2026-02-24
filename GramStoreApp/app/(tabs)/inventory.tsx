import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Product = {
  _id?: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  sellingPrice: number;
  costPrice: number;
  supplier: string;
  expiryDate: string;
};

const API_URL = "http://localhost:5000/products";

export default function InventoryScreen() {

  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState<any>({
    name: "",
    category: "",
    stock: "",
    minStock: "",
    sellingPrice: "",
    costPrice: "",
    supplier: "",
    expiryDate: "",
  });

  // FETCH PRODUCTS FROM BACKEND
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch products");
    }
  };

  // LOAD ON START
  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD PRODUCT TO BACKEND
  const addProduct = async () => {

    if (!form.name || !form.stock) {
      Alert.alert("Error", "Name and Stock required");
      return;
    }

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          stock: Number(form.stock),
          minStock: Number(form.minStock),
          sellingPrice: Number(form.sellingPrice),
          costPrice: Number(form.costPrice),
          supplier: form.supplier,
          expiryDate: form.expiryDate,
        }),
      });

      fetchProducts();

      setModalVisible(false);

      setForm({
        name: "",
        category: "",
        stock: "",
        minStock: "",
        sellingPrice: "",
        costPrice: "",
        supplier: "",
        expiryDate: "",
      });

    } catch {
      Alert.alert("Error", "Failed to add product");
    }
  };

  const renderItem = ({ item }: { item: Product }) => {

    const lowStock = item.stock <= item.minStock;

    return (
      <View style={styles.card}>

        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.stock}>
            Stock: {item.stock}
            {lowStock && <Text style={styles.low}> LOW</Text>}
          </Text>
        </View>

        <Text style={styles.category}>{item.category}</Text>

        <Text>Selling Price: ₹{item.sellingPrice}</Text>
        <Text>Cost Price: ₹{item.costPrice}</Text>
        <Text>Supplier: {item.supplier}</Text>

        <Text style={styles.expiry}>
          Expiry: {item.expiryDate}
        </Text>

      </View>
    );
  };

  return (

    <View style={styles.container}>

      {/* SEARCH */}
      <TextInput
        placeholder="Search inventory..."
        style={styles.search}
      />

      {/* FILTER */}
      <View style={styles.filterRow}>

        <TouchableOpacity style={styles.filterBtn}>
          <Text>All</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBtn}>
          <Text>Low Stock</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBtn}>
          <Text>Expiring Soon</Text>
        </TouchableOpacity>

      </View>

      {/* PRODUCT LIST */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || ""}
      />

      {/* FLOATING BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>

      {/* ADD MODAL */}
      <Modal visible={modalVisible} animationType="slide">

        <ScrollView style={styles.modal}>

          <Text style={styles.modalTitle}>Add New Item</Text>

          {[
            "name",
            "category",
            "stock",
            "minStock",
            "sellingPrice",
            "costPrice",
            "supplier",
            "expiryDate",
          ].map((field) => (

            <TextInput
              key={field}
              placeholder={field}
              style={styles.input}
              value={form[field]}
              onChangeText={(text) =>
                setForm({ ...form, [field]: text })
              }
            />

          ))}

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={addProduct}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

        </ScrollView>

      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 12,
  },

  search: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  filterRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  filterBtn: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  stock: {
    fontWeight: "bold",
  },

  low: {
    color: "red",
  },

  category: {
    color: "green",
    marginVertical: 5,
  },

  expiry: {
    color: "orange",
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2e7d32",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  saveBtn: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
  },

  saveText: {
    color: "white",
    textAlign: "center",
  },

  cancel: {
    textAlign: "center",
    marginTop: 10,
    color: "red",
  },

});