import React, { useState, useEffect } from "react";
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

type GroupOrder = {
  _id?: string;
  orderName: string;
  distributor: string;
  participants: number;
  totalAmount: number;
  discount: number;
  status: string;
  deadline: string;
};

const API_URL = "http://localhost:5000/grouporders";

export default function GroupOrdersScreen() {

  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState<any>({
    orderName: "",
    distributor: "",
    participants: "",
    totalAmount: "",
    discount: "",
    deadline: "",
  });

  const fetchOrders = async () => {

    const res = await fetch(API_URL);

    const data = await res.json();

    setOrders(data);

  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async () => {

    await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        orderName: form.orderName,
        distributor: form.distributor,
        participants: Number(form.participants),
        totalAmount: Number(form.totalAmount),
        discount: Number(form.discount),
        deadline: form.deadline,
      }),

    });

    fetchOrders();

    setModalVisible(false);

  };

  const renderItem = ({ item }: { item: GroupOrder }) => (

    <View style={styles.card}>

      <Text style={styles.name}>
        {item.orderName}
      </Text>

      <Text>Distributor: {item.distributor}</Text>

      <Text>Participants: {item.participants}</Text>

      <Text>Total Amount: ₹{item.totalAmount}</Text>

      <Text>Discount: {item.discount}%</Text>

      <Text>Deadline: {item.deadline}</Text>

      <Text style={styles.active}>
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
            Create Group Order
          </Text>

          {[
            "orderName",
            "distributor",
            "participants",
            "totalAmount",
            "discount",
            "deadline",
          ].map(field => (

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
            onPress={createOrder}
          >
            <Text style={styles.saveText}>
              Create
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

  active: {
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