import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { DataEs } from "../interfaces/DataEs";
import { Transaksi } from "../interfaces/Transaksi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigasiRoot } from "../App";
import { useNavigation } from "@react-navigation/native";

export default function Produksi(){
  const navigasi=useNavigation<StackNavigationProp<NavigasiRoot>>()
  const [transaksi,setTransaksi]=useState<Transaksi[]>([]);
  const [inputJumlah,setInputJumlah]=useState('');
  const saveData=async(newData:DataEs,newTransaksi:Transaksi[])=>{
    try {
      await AsyncStorage.setItem('esBatuData',JSON.stringify(newData));
      await AsyncStorage.setItem('esBatuTransaksi',JSON.stringify(newTransaksi));
    } catch (error) {
      console.error(`Gagal menyimpan data karena ${error}`);
    }
  };
  const keHome=()=>{
    navigasi.navigate('Home');
  }
  const [data,setData]=useState<DataEs>({
    totalProduksi:0,
    totalKeras:0,
    totalTerjual:0,
    uangTersimpan:0
  });
  const tambahTransaksi=(
    jenis:Transaksi['jenis'],
    jumlah:number,
    keterangan:string
  )=>{
    const newTransaksi:Transaksi={
      id:Date.now(),
      waktu:new Date().toLocaleString('id-ID'),
      jenis,
      jumlah,
      keterangan,
    };
    const updatedTransaksi=[newTransaksi,...transaksi].slice(0,50);
    setTransaksi(updatedTransaksi);
    return updatedTransaksi;
  }
  const tambahProduksi=()=>{
    const jml=parseInt(inputJumlah);
    if (isNaN(jml)||jml<=0) {
      Alert.alert('Error','Kesalahan input data');
      return;
    }
    const dataNew={
      ...data,
      totalProduksi:data.totalProduksi+jml,
    };
    const newTransaksi=tambahTransaksi(
      'produksi',
      jml,
      `Memproduksu ${jml}  es batu yang masih cair`
    );
    setData(dataNew);
    saveData(dataNew,newTransaksi);
    setInputJumlah('');
    Alert.alert('Sukses',`Berhasil produksi es batu sebanyak ${jml} buah`);
  }
  return(
    <View style={styling.formContainer}>
      <Text style={styling.formTitle}>
        <FontAwesome name="edit" size={30} color="black"/> Buat Es batu
      </Text>
      <TextInput
        placeholder="Jumlah es yang dibuat"
        keyboardType="numeric"
        value={inputJumlah}
        onChangeText={setInputJumlah}
        style={styling.input}
      />
      <ScrollView>
        <TouchableOpacity onPress={tambahProduksi} style={styling.button}>
          <Text>Simpan</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>keHome()} style={styling.buttonCancel}>
          <Text>Kembali</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styling=StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonCancel: {
    backgroundColor: '#666',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
});
