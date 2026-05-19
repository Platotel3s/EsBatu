import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { NavigasiRoot } from "../App";
import { DataEs } from "../interfaces/DataEs";
import { Transaksi } from "../interfaces/Transaksi";

export default function Penjualan() {
  const navigasi = useNavigation<StackNavigationProp<NavigasiRoot>>();
  const [inputJumlah, setInputJumlah] = useState("");
  const [data, setData] = useState<DataEs>({
    totalProduksi: 0,
    totalKeras: 0,
    totalTerjual: 0,
    uangTersimpan: 0,
  });
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("esBatuData");
      const savedTransaksi = await AsyncStorage.getItem("esBatuTransaksi");
      if (savedData) setData(JSON.parse(savedData));
      if (savedTransaksi) setTransaksi(JSON.parse(savedTransaksi));
    } catch (error) {
      console.error("Gagal load data:", error);
    }
  };

  const handlePenjualan = async () => {
    const jumlah = parseInt(inputJumlah);
    if (isNaN(jumlah) || jumlah <= 0) {
      Alert.alert("Error", "Jumlah harus angka positif!");
      return;
    }

    if (jumlah > data.totalKeras) {
      Alert.alert("Error", `Stok tidak cukup! Tersedia: ${data.totalKeras} buah`);
      return;
    }

    const pendapatan = (jumlah / 4) * 5000;
    const newData = {
      ...data,
      totalKeras: data.totalKeras - jumlah,
      totalTerjual: data.totalTerjual + jumlah,
      uangTersimpan: data.uangTersimpan + pendapatan,
    };

    const newTransaksi: Transaksi = {
      id: Date.now(),
      waktu: new Date().toLocaleString("id-ID"),
      jenis: "penjualan",
      jumlah,
      keterangan: `Terjual ${jumlah} es = ${jumlah / 4} bungkus @Rp5.000 = Rp${pendapatan.toLocaleString()}`,
    };

    const updatedTransaksi = [newTransaksi, ...transaksi].slice(0, 50);

    try {
      await AsyncStorage.setItem("esBatuData", JSON.stringify(newData));
      await AsyncStorage.setItem("esBatuTransaksi", JSON.stringify(updatedTransaksi));

      setData(newData);
      setTransaksi(updatedTransaksi);
      setInputJumlah("");

      Alert.alert("Sukses", `Pendapatan: Rp ${pendapatan.toLocaleString()}`, [
        { text: "OK", onPress: () => navigasi.navigate("Home") }
      ]);
    } catch (error) {
      console.error("Gagal simpan data:", error);
    }
  };

  return (
    <View style={styling.formContainer}>
      <Text style={styling.formTitle}>
        <FontAwesome name="money" size={30} color="#192f6a" /> Catat Penjualan
      </Text>

      <TextInput
        placeholder="Jumlah es yang terjual (bukan bungkus)"
        keyboardType="numeric"
        value={inputJumlah}
        onChangeText={setInputJumlah}
        style={styling.input}
      />

      <TouchableOpacity onPress={handlePenjualan} style={styling.button}>
        <Text style={styling.buttonText}>Simpan</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigasi.navigate("Home")} style={styling.buttonCancel}>
        <Text style={styling.buttonText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}

const styling = StyleSheet.create({
  formContainer: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#e0e7ff" },
  formTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#192f6a" },
  input: { backgroundColor: "white", borderRadius: 10, padding: 15, fontSize: 16, borderWidth: 1, borderColor: "#ddd", marginBottom: 15 },
  button: { backgroundColor: "#ff7b00", borderRadius: 10, padding: 15, alignItems: "center", marginBottom: 10 },
  buttonCancel: { backgroundColor: "#666", borderRadius: 10, padding: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
