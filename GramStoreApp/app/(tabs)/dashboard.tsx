import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

type Product = {
  _id?: string;
  name: string;
  stock: number;
  minStock: number;
  expiryDate: string;
};

export default function Dashboard() {

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {

    try {

      const userId = await AsyncStorage.getItem("userId");

      if (!userId) return;

      const res = await fetch(
        `http://localhost:5000/products/${userId}`
      );

      const data = await res.json();

      setProducts(data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  // LOW STOCK
  const lowStock = products.filter(
    p => p.stock <= p.minStock
  );

  // EXPIRING SOON
  const expiringSoon = products.filter(p => {

    if (!p.expiryDate) return false;

    const expiry = new Date(p.expiryDate);

    const today = new Date();

    const diff =
      (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff <= 10 && diff >= 0;

  });

  // EXPIRED
  const expiredProducts = products.filter(p => {

    if (!p.expiryDate) return false;

    return new Date(p.expiryDate) < new Date();

  });

  // HEALTHY
  const healthyProducts = products.filter(
    p => p.stock > p.minStock
  );

  // TOTAL QUANTITY
  const totalQuantity = products.reduce(
    (sum, p) => sum + p.stock,
    0
  );

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
          <Text style={[styles.statNumber,{color:"red"}]}>
            {lowStock.length}
          </Text>
          <Text>Low Stock</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statNumber,{color:"orange"}]}>
            {expiringSoon.length}
          </Text>
          <Text>Expiring Soon</Text>
        </View>

      </View>

      {/* PRODUCT ANALYTICS */}

      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Product Analytics
        </Text>

        <Text style={styles.analytics}>
          Total Quantity: {totalQuantity}
        </Text>

        <Text style={styles.analytics}>
          Healthy Products: {healthyProducts.length}
        </Text>

        <Text style={styles.analytics}>
          Expiring Soon: {expiringSoon.length}
        </Text>

        <Text style={styles.analytics}>
          Expired Products: {expiredProducts.length}
        </Text>

      </View>

      {/* LOW STOCK */}

      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Low Stock Alerts
        </Text>

        <FlatList
          data={lowStock}
          renderItem={renderLowStock}
          keyExtractor={(item,index)=>index.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No low stock items
            </Text>
          }
        />

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

  analytics: {
    marginTop: 5,
    fontSize: 15,
  },

  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  alertText: {
    color: "red",
    fontWeight: "bold",
  },

  empty: {
    color: "gray",
    textAlign: "center",
    marginTop: 5,
  },

});