import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

type OrderStatus =
  | "Pending"
  | "Approved"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type Order = {
  _id?: string;
  userId?: string;
  productName: string;
  quantity: number;
  distributor: string;
  status: OrderStatus;
  date?: string;
};

const API_URL = "http://localhost:5000/orders";

export default function OrdersScreen() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    productName: "",
    quantity: "",
    distributor: "",
  });

  // LOAD USER AND FETCH ORDERS
  const loadUserAndOrders = async () => {

    try {

      const id = await AsyncStorage.getItem("userId");

      if (!id) {

        Alert.alert("Error", "User not logged in");

        return;

      }

      setUserId(id);

      fetchOrders(id);

    } catch {

      Alert.alert("Error", "Failed to load user");

    }

  };

  // FETCH USER-SPECIFIC ORDERS
  const fetchOrders = async (uid?: string) => {

    try {

      const id = uid || userId;

      if (!id) return;

      const res = await fetch(`${API_URL}/${id}`);

      const data = await res.json();

      setOrders(data);

    } catch (error) {

      console.log("Fetch Orders Error:", error);

      Alert.alert("Error", "Failed to fetch orders");

    }

  };

  useEffect(() => {

    loadUserAndOrders();

  }, []);

  // ADD ORDER
  const addOrder = async () => {

    try {

      if (!form.productName || !form.quantity || !form.distributor) {

        Alert.alert("Error", "Fill all fields");

        return;

      }

      const id = await AsyncStorage.getItem("userId");

      if (!id) return;

      await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          userId: id,

          productName: form.productName,

          quantity: Number(form.quantity),

          distributor: form.distributor,

        }),

      });

      // refresh orders
      fetchOrders(id);

      // reset form
      setForm({
        productName: "",
        quantity: "",
        distributor: "",
      });

      setModalVisible(false);

      Alert.alert("Success", "Order placed");

    } catch (error) {

      console.log("Add Order Error:", error);

      Alert.alert("Error", "Failed to place order");

    }

  };

  // RENDER ORDER
  const renderItem = ({ item }: { item: Order }) => (

    <View style={styles.card}>

      <Text style={styles.name}>
        {item.productName}
      </Text>

      <Text style={styles.text}>
        Quantity: {item.quantity}
      </Text>

      <Text style={styles.text}>
        Distributor: {item.distributor}
      </Text>

      <Text
        style={[
          styles.status,
          item.status === "Pending" && styles.pending,
          item.status === "Approved" && styles.approved,
          item.status === "Shipped" && styles.shipped,
          item.status === "Delivered" && styles.delivered,
          item.status === "Cancelled" && styles.cancelled,
        ]}
      >
        Status: {item.status}
      </Text>

      {item.date && (

        <Text style={styles.date}>
          {new Date(item.date).toDateString()}
        </Text>

      )}

    </View>

  );

  return (

    <View style={styles.container}>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item._id || Math.random().toString()
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No orders found
          </Text>
        }
      />

      {/* FLOAT BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">

        <ScrollView style={styles.modal}>

          <Text style={styles.title}>
            Place Order
          </Text>

          <TextInput
            placeholder="Product Name"
            style={styles.input}
            value={form.productName}
            onChangeText={(text) =>
              setForm({ ...form, productName: text })
            }
          />

          <TextInput
            placeholder="Quantity"
            style={styles.input}
            keyboardType="numeric"
            value={form.quantity}
            onChangeText={(text) =>
              setForm({ ...form, quantity: text })
            }
          />

          <TextInput
            placeholder="Distributor"
            style={styles.input}
            value={form.distributor}
            onChangeText={(text) =>
              setForm({ ...form, distributor: text })
            }
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={addOrder}
          >
            <Text style={styles.saveText}>
              Place Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancel}>
              Cancel
            </Text>
          </TouchableOpacity>

        </ScrollView>

      </Modal>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 12,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  text: {
    fontSize: 14,
  },

  status: {
    marginTop: 5,
    fontWeight: "bold",
  },

  pending: {
    color: "orange",
  },

  approved: {
    color: "blue",
  },

  shipped: {
    color: "purple",
  },

  delivered: {
    color: "green",
  },

  cancelled: {
    color: "red",
  },

  date: {
    color: "gray",
    marginTop: 5,
  },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#2e7d32",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  fabText: {
    color: "#fff",
    fontSize: 30,
  },

  modal: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  saveBtn: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    textAlign: "center",
  },

  cancel: {
    textAlign: "center",
    marginTop: 15,
    color: "red",
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },

});