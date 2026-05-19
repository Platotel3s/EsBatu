import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { Transaksi } from "../interfaces/Transaksi";

export default function Riwayat() {
  const navigasi = useNavigation();
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);

  useEffect(() => {
    const loadTransaksi = async () => {
      const savedTransaksi = await AsyncStorage.getItem("esBatuTransaksi");
      if (savedTransaksi) setTransaksi(JSON.parse(savedTransaksi));
    };
    loadTransaksi();
  }, []);

  const getIcon = (jenis: Transaksi["jenis"]) => {
    switch (jenis) {
      case "produksi": return "rocket";
      case "keras": return "cubes";
      case "penjualan": return "money";
      case "setorUang": return "building";
      default: return "list";
    }
  };

  return (
    <View style={styling.container}>
      <View style={styling.header}>
        <Text style={styling.title}><FontAwesome name="history" size={26} /> Riwayat Log</Text>
      </View>

      <ScrollView style={styling.listContainer}>
        {transaksi.length === 0 ? (
          <Text style={styling.emptyText}>Belum ada riwayat transaksi.</Text>
        ) : (
          transaksi.map((item) => (
            <View key={item.id} style={styling.itemCard}>
              <View style={styling.iconWrapper}>
                <FontAwesome name={getIcon(item.jenis)} size={24} color="#192f6a" />
              </View>
              <View style={styling.textWrapper}>
                <Text style={styling.waktuText}>{item.waktu}</Text>
                <Text style={styling.keteranganText}>{item.keterangan}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity onPress={() => navigasi.goBack()} style={styling.buttonBack}>
        <Text style={styling.buttonText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}

const styling = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e0e7ff", padding: 20 },
  header: { alignItems: "center", marginBottom: 20, marginTop: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#192f6a" },
  listContainer: { flex: 1 },
  emptyText: { textAlign: "center", marginTop: 40, color: "#666", fontSize: 16 },
  itemCard: { flexDirection: "row", backgroundColor: "white", padding: 15, borderRadius: 12, marginBottom: 10, alignItems: "center", elevation: 2 },
  iconWrapper: { width: 45, height: 45, borderRadius: 25, backgroundColor: "#e0e7ff", justifyContent: "center", alignItems: "center", marginRight: 15 },
  textWrapper: { flex: 1 },
  waktuText: { fontSize: 11, color: "#999", marginBottom: 2 },
  keteranganText: { fontSize: 14, color: "#333", fontWeight: "500" },
  buttonBack: { backgroundColor: "#192f6a", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10, marginBottom: 10 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 }
});
