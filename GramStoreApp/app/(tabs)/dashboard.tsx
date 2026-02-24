import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

type Product = {
  _id?: string;
  name: string;
  stock: number;
  minStock: number;
  expiryDate: string;
};

const API_URL = "http://localhost:5000/products";

export default function Dashboard() {

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const lowStock = products.filter(
    p => p.stock <= p.minStock
  );

  const expiringSoon = products.filter(p => {

    const expiry = new Date(p.expiryDate);
    const today = new Date();

    const diff =
      (expiry.getTime() - today.getTime()) /
      (1000 * 3600 * 24);

    return diff <= 30;

  });

  const renderLowStock = ({ item }: any) => (
    <View style={styles.alertItem}>
      <Text>{item.name}</Text>
      <Text style={styles.alertText}>
        {item.stock} left
      </Text>
    </View>
  );

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.greeting}>
        Welcome to GramStore
      </Text>

      <Text style={styles.date}>
        {new Date().toDateString()}
      </Text>

      {/* STATS */}
      <View style={styles.statsRow}>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {products.length}
          </Text>
          <Text>Total Products</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {lowStock.length}
          </Text>
          <Text>Low Stock</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {expiringSoon.length}
          </Text>
          <Text>Expiring Soon</Text>
        </View>

      </View>

      {/* LOW STOCK ALERT */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Low Stock Alerts
        </Text>

        <FlatList
          data={lowStock}
          renderItem={renderLowStock}
          keyExtractor={(item) => item._id || ""}
        />

      </View>

      {/* BEST SELLING PLACEHOLDER */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Best Selling Products
        </Text>

        <Text>Rice (5kg) - 45 sold</Text>
        <Text>Cooking Oil - 32 sold</Text>

      </View>

    </ScrollView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },

  greeting: {
    fontSize: 22,
    fontWeight: "bold",
  },

  date: {
    color: "gray",
    marginBottom: 15,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    width: "30%",
    alignItems: "center",
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
  },

  section: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  alertText: {
    color: "red",
  },

});