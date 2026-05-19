import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { DataEs } from "../interfaces/DataEs";

export default function Statistik() {
  const navigasi = useNavigation();
  const [data, setData] = useState<DataEs>({
    totalProduksi: 0,
    totalKeras: 0,
    totalTerjual: 0,
    uangTersimpan: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const savedData = await AsyncStorage.getItem("esBatuData");
      if (savedData) setData(JSON.parse(savedData));
    };
    loadData();
  }, []);

  const totalCair = data.totalProduksi - data.totalKeras - data.totalTerjual;
  const totalPendapatan = (data.totalTerjual / 4) * 5000;

  return (
    <ScrollView style={styling.container}>
      <View style={styling.header}>
        <Text style={styling.title}><FontAwesome name="line-chart" size={28} /> Statistik Es Batu</Text>
      </View>

      <View style={styling.statsCard}>
        <Text style={styling.label}>Total Produksi:</Text>
        <Text style={styling.value}>{data.totalProduksi} Biji</Text>
      </View>

      <View style={styling.statsCard}>
        <Text style={styling.label}>Stok Es Keras (Ready):</Text>
        <Text style={styling.value}>{data.totalKeras} Biji</Text>
      </View>

      <View style={styling.statsCard}>
        <Text style={styling.label}>Stok Es Cair:</Text>
        <Text style={styling.value}>{totalCair < 0 ? 0 : totalCair} Biji</Text>
      </View>

      <View style={styling.statsCard}>
        <Text style={styling.label}>Total Terjual:</Text>
        <Text style={styling.value}>{data.totalTerjual} Biji ({data.totalTerjual / 4} Bungkus)</Text>
      </View>

      <View style={styling.statsCard}>
        <Text style={styling.label}>Estimasi Pendapatan:</Text>
        <Text style={[styling.value, { color: "#4caf50" }]}>Rp {totalPendapatan.toLocaleString()}</Text>
      </View>

      <View style={styling.statsCard}>
        <Text style={styling.label}>Uang Tersimpan Kas:</Text>
        <Text style={[styling.value, { color: "#2196f3" }]}>Rp {data.uangTersimpan.toLocaleString()}</Text>
      </View>

      <TouchableOpacity onPress={() => navigasi.goBack()} style={styling.buttonBack}>
        <Text style={styling.buttonText}>Kembali ke Menu Utama</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styling = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e0e7ff", padding: 20 },
  header: { alignItems: "center", marginBottom: 20, marginTop: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#192f6a" },
  statsCard: { backgroundColor: "white", padding: 18, borderRadius: 15, marginBottom: 12, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  label: { fontSize: 14, color: "#666", marginBottom: 4 },
  value: { fontSize: 20, fontWeight: "bold", color: "#333" },
  buttonBack: { backgroundColor: "#192f6a", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 15, marginBottom: 30 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 }
});
