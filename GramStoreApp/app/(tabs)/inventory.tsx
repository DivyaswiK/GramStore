import React, { useState, useCallback } from "react";

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

import AsyncStorage from "@react-native-async-storage/async-storage";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useFocusEffect } from "expo-router";

type Product = {
  _id?: string;
  userId?: string;
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

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

  const [userId, setUserId] = useState<string | null>(null);

  // FETCH PRODUCTS
  const fetchProducts = async (uid: string) => {

    try {

      const response = await fetch(`${API_URL}/${uid}`);

      const data = await response.json();

      setProducts(data);

      applySearchAndFilter(searchText, selectedFilter, data);

    } catch {

      Alert.alert("Error", "Failed to fetch products");

    }

  };

  useFocusEffect(
    useCallback(() => {

      const load = async () => {

        const id = await AsyncStorage.getItem("userId");

        if (!id) {
          Alert.alert("Error", "User not logged in");
          return;
        }

        setUserId(id);

        fetchProducts(id);

      };

      load();

    }, [])
  );

  const applySearchAndFilter = (
    search: string,
    filter: string,
    sourceProducts?: Product[]
  ) => {

    let result = [...(sourceProducts || products)];

    if (search.trim() !== "") {

      result = result.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );

    }

    if (filter === "Low Stock") {

      result = result.filter(
        product => product.stock <= product.minStock
      );

    }

    else if (filter === "Expiring Soon") {

      const today = new Date();

      result = result.filter(product => {

        if (!product.expiryDate) return false;

        const expiry = new Date(product.expiryDate);

        const diffDays =
          (expiry.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24);

        return diffDays <= 10 && diffDays >= 0;

      });

    }

    setFilteredProducts(result);

  };

  const applyFilter = (filter: string) => {

    setSelectedFilter(filter);

    applySearchAndFilter(searchText, filter);

  };

  const handleSearch = (text: string) => {

    setSearchText(text);

    applySearchAndFilter(text, selectedFilter);

  };

  // ADD PRODUCT
  const addProduct = async () => {

    if (!form.name || !form.stock) {

      Alert.alert("Error", "Name and Stock required");

      return;

    }

    try {

      const id = await AsyncStorage.getItem("userId");

      if (!id) return;

      await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          userId: id,

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

      fetchProducts(id);

      setModalVisible(false);

      resetForm();

    } catch {

      Alert.alert("Error", "Failed to add product");

    }

  };

  // UPDATE PRODUCT
  const updateProduct = async () => {

    if (!editingId) return;

    try {

      await fetch(`${API_URL}/${editingId}`, {

        method: "PUT",

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

      if (userId) fetchProducts(userId);

      setModalVisible(false);

      setEditMode(false);

      setEditingId(null);

      resetForm();

    } catch {

      Alert.alert("Error", "Failed to update product");

    }

  };

  const resetForm = () => {

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

  };

  // RENDER ITEM
  const renderItem = ({ item }: { item: Product }) => {

    const lowStock = item.stock <= item.minStock;

    return (

      <View style={styles.card}>

        <View style={styles.row}>

          <Text style={styles.name}>
            {item.name}
          </Text>

          <Text style={styles.stock}>
            Stock: {item.stock}
            {lowStock && <Text style={styles.low}> LOW</Text>}
          </Text>

        </View>

        <Text style={styles.category}>
          {item.category}
        </Text>

        <Text>Selling Price: ₹{item.sellingPrice}</Text>

        <Text>Cost Price: ₹{item.costPrice}</Text>

        <Text>Supplier: {item.supplier}</Text>

        <Text style={styles.expiry}>
          Expiry: {item.expiryDate}
        </Text>

        {/* EDIT BUTTON */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {

            setForm({
              name: item.name,
              category: item.category,
              stock: String(item.stock),
              minStock: String(item.minStock),
              sellingPrice: String(item.sellingPrice),
              costPrice: String(item.costPrice),
              supplier: item.supplier,
              expiryDate: item.expiryDate,
            });

            setEditingId(item._id || null);
            setEditMode(true);
            setModalVisible(true);

          }}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

      </View>

    );

  };

  return (

    <View style={styles.container}>

      <TextInput
        placeholder="Search inventory..."
        style={styles.search}
        value={searchText}
        onChangeText={handleSearch}
      />

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBtn} onPress={() => applyFilter("All")}>
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => applyFilter("Low Stock")}>
          <Text>Low Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => applyFilter("Expiring Soon")}>
          <Text>Expiring Soon</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || Math.random().toString()}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setEditMode(false);
          setModalVisible(true);
        }}
      >
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">

        <ScrollView style={styles.modal}>

          <Text style={styles.modalTitle}>
            {editMode ? "Edit Item" : "Add New Item"}
          </Text>

          {Object.keys(form).map(field => (

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
            onPress={editMode ? updateProduct : addProduct}
          >
            <Text style={styles.saveText}>
              {editMode ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

        </ScrollView>

      </Modal>

    </View>

  );

}

const styles = StyleSheet.create({

  container:{flex:1,backgroundColor:"#f5f5f5",padding:12},

  search:{backgroundColor:"white",padding:12,borderRadius:10,marginBottom:10},

  filterRow:{flexDirection:"row",marginBottom:10},

  filterBtn:{backgroundColor:"#e0e0e0",padding:8,borderRadius:10,marginRight:10},

  card:{backgroundColor:"white",padding:15,borderRadius:12,marginBottom:10},

  row:{flexDirection:"row",justifyContent:"space-between"},

  name:{fontSize:18,fontWeight:"bold"},

  stock:{fontWeight:"bold"},

  low:{color:"red"},

  category:{color:"green",marginVertical:5},

  expiry:{color:"orange"},

  editBtn:{marginTop:10,backgroundColor:"#358839",padding:8,borderRadius:5,alignSelf:"flex-start"},

  editText:{color:"white",fontWeight:"bold"},

  fab:{position:"absolute",bottom:20,right:20,backgroundColor:"#2e7d32",width:60,height:60,borderRadius:30,justifyContent:"center",alignItems:"center"},

  modal:{padding:20},

  modalTitle:{fontSize:22,fontWeight:"bold",marginBottom:20},

  input:{backgroundColor:"#eee",padding:12,borderRadius:10,marginBottom:10},

  saveBtn:{backgroundColor:"#2e7d32",padding:15,borderRadius:10},

  saveText:{color:"white",textAlign:"center"},

  cancel:{textAlign:"center",marginTop:10,color:"red"}

});

//   empty: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "gray",
//   },

// });