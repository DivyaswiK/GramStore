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
} from "react-native";

type Order = {
  _id?: string;
  productName: string;
  quantity: number;
  distributor: string;
  status: string;
};

const API_URL = "http://localhost:5000/orders";

export default function OrdersScreen() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState<any>({
    productName: "",
    quantity: "",
    distributor: "",
  });

  const fetchOrders = async () => {

    const res = await fetch(API_URL);

    const data = await res.json();

    setOrders(data);

  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async () => {

    await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        productName: form.productName,
        quantity: Number(form.quantity),
        distributor: form.distributor,
      }),

    });

    fetchOrders();

    setModalVisible(false);

  };

  const renderItem = ({ item }: { item: Order }) => (

    <View style={styles.card}>

      <Text style={styles.name}>
        {item.productName}
      </Text>

      <Text>Quantity: {item.quantity}</Text>

      <Text>Distributor: {item.distributor}</Text>

      <Text style={
        item.status === "Pending"
          ? styles.pending
          : styles.delivered
      }>
        {item.status}
      </Text>

    </View>

  );

  return (

    <View style={styles.container}>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || ""}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">

        <ScrollView style={styles.modal}>

          <Text style={styles.title}>
            Place Order
          </Text>

          {["productName", "quantity", "distributor"]
            .map(field => (

              <TextInput
                key={field}
                placeholder={field}
                style={styles.input}
                onChangeText={(text) =>
                  setForm({
                    ...form,
                    [field]: text,
                  })
                }
              />

          ))}

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={addOrder}
          >
            <Text style={styles.saveText}>
              Place Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setModalVisible(false)
            }
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
    backgroundColor: "#f5f5f5",
    padding: 12,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  pending: {
    color: "orange",
    marginTop: 5,
  },

  delivered: {
    color: "green",
    marginTop: 5,
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

  fabText: {
    color: "white",
    fontSize: 30,
  },

  modal: {
    padding: 20,
  },

  title: {
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