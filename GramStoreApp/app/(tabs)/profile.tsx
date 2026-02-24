import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_URL = "http://localhost:5000";

export default function ProfileScreen() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const loadProfile = async () => {

    try {

      const storedName = await AsyncStorage.getItem("userName");
      console.log(storedName)
      if (!storedName) return;

      const res = await fetch(`${API_URL}/user/${storedName}`);

      const data = await res.json();

      if (data.success) {

        setName(data.user.name);
        setPhone(data.user.phone);

      }

    } catch (error) {

      console.log("Profile load error:", error);

    }

  };

  useEffect(() => {
    loadProfile();
  }, []);

  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "";

  return (

    <ScrollView style={styles.container}>

      {/* HEADER
      <View style={styles.header}>

        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Profile</Text>

          <MaterialCommunityIcons
            name="cog-outline"
            size={24}
            color="white"
          />
        </View>

      </View> */}

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initials}
          </Text>
        </View>

        <Text style={styles.name}>
          {name}
        </Text>

        <Text style={styles.shop}>
          {name ? `${name} General Store` : ""}
        </Text>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>
            Edit Profile
          </Text>
        </TouchableOpacity>

      </View>


      {/* PERSONAL INFO */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <View style={styles.row}>
          <MaterialCommunityIcons name="phone" size={22} color="gray" />
          <View style={styles.info}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{phone}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="account-outline" size={22} color="gray" />
          <View style={styles.info}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{name}</Text>
          </View>
        </View>

      </View>


      {/* APP SETTINGS */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          App Settings
        </Text>

        <View style={styles.settingRow}>
          <MaterialCommunityIcons name="theme-light-dark" size={22} color="gray" />
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch />
        </View>

        <View style={styles.settingRow}>
          <MaterialCommunityIcons name="bell-outline" size={22} color="gray" />
          <Text style={styles.settingText}>Notifications</Text>
          <Switch value={true} />
        </View>

        <View style={styles.settingRow}>
          <MaterialCommunityIcons name="translate" size={22} color="gray" />
          <Text style={styles.settingText}>Language</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="gray" />
        </View>

      </View>

    </ScrollView>

  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    backgroundColor: "#2e7d32",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  profileCard: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#555",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  shop: {
    color: "gray",
    marginBottom: 10,
  },

  editBtn: {
    borderWidth: 1,
    borderColor: "#2e7d32",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  editText: {
    color: "#2e7d32",
    fontWeight: "500",
  },

  section: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 15,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 15,
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    marginBottom: 15,
  },

  info: {
    marginLeft: 10,
    flex: 1,
  },

  label: {
    color: "gray",
    fontSize: 13,
  },

  value: {
    fontSize: 15,
    fontWeight: "500",
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  settingText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

});