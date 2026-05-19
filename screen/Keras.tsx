import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { NavigasiRoot } from "../App";
import { DataEs } from "../interfaces/DataEs";
import { Transaksi } from "../interfaces/Transaksi";

export default function Keras() {
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

  const handleKeras = async () => {
    const jumlah = parseInt(inputJumlah);
    if (isNaN(jumlah) || jumlah <= 0) {
      Alert.alert("Error", "Jumlah harus angka positif!");
      return;
    }
    const maxBisaKeras = data.totalProduksi - data.totalKeras - data.totalTerjual;
    if (jumlah > maxBisaKeras) {
      Alert.alert("Error", `Es cair hanya tersisa ${maxBisaKeras} buah!`);
      return;
    }

    const newData = {
      ...data,
      totalKeras: data.totalKeras + jumlah,
    };

    const newTransaksi: Transaksi = {
      id: Date.now(),
      waktu: new Date().toLocaleString("id-ID"),
      jenis: "keras",
      jumlah,
      keterangan: `${jumlah} es batu menjadi keras (siap jual)`,
    };

    const updatedTransaksi = [newTransaksi, ...transaksi].slice(0, 50);

    try {
      await AsyncStorage.setItem("esBatuData", JSON.stringify(newData));
      await AsyncStorage.setItem("esBatuTransaksi", JSON.stringify(updatedTransaksi));
      
      setData(newData);
      setTransaksi(updatedTransaksi);
      setInputJumlah("");
      
      Alert.alert("Sukses", `✅ ${jumlah} es batu menjadi keras!`, [
        { text: "OK", onPress: () => navigasi.navigate("Home") }
      ]);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  return (
    <View style={styling.formContainer}>
      <Text style={styling.formTitle}>
        <FontAwesome name="cubes" size={30} color="#192f6a" /> Catat Es Keras
      </Text>
      
      <TextInput
        placeholder="Jumlah es yang sudah keras"
        keyboardType="numeric"
        value={inputJumlah}
        onChangeText={setInputJumlah}
        style={styling.input}
      />

      <TouchableOpacity onPress={handleKeras} style={styling.button}>
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
