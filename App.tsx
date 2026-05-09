import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Style';
import { DataEs } from './interfaces/DataEs';
import { Transaksi } from './interfaces/Transaksi';

export default function App(){
  const [data,setData]=useState<DataEs>({
    totalProduksi:0,
    totalKeras:0,
    totalTerjual:0,
    uangTersimpan:0,
  });
  const [transaksi,setTransaksi]=useState<Transaksi[]>([]);
  const [inputJumlah,setInputJumlah]=useState('');
  const [menu,setMenu]=useState('utama');

  useEffect(()=>{
    loadData();
  }, []);

  const loadData=async()=>{
    try {
      const savedData=await AsyncStorage.getItem('esBatuData');
      const savedTransaksi=await AsyncStorage.getItem('esBatuTransaksi');
      
      if (savedData) setData(JSON.parse(savedData));
      if (savedTransaksi) setTransaksi(JSON.parse(savedTransaksi));
    } catch (error) {
      console.error('Gagal load data:',error);
    }
  };

  const saveData=async(newData: DataEs,newTransaksi:Transaksi[]) => {
    try {
      await AsyncStorage.setItem('esBatuData',JSON.stringify(newData));
      await AsyncStorage.setItem('esBatuTransaksi',JSON.stringify(newTransaksi));
    } catch (error) {
      console.error('Gagal simpan data:',error);
    }
  };

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
    const updatedTransaksi=[newTransaksi,...transaksi].slice(0, 50);
    setTransaksi(updatedTransaksi);
    return updatedTransaksi;
  };
  const handleProduksi=()=>{
    const jumlah=parseInt(inputJumlah);
    if (isNaN(jumlah)||jumlah<=0) {
      Alert.alert('Error','Jumlah harus angka positif!');
      return;
    }

    const newData={
      ...data,
      totalProduksi:data.totalProduksi + jumlah,
    };
    const newTransaksi=tambahTransaksi(
      'produksi',
      jumlah,
      `Memproduksi ${jumlah} es batu (masih cair)`
    );
    setData(newData);
    saveData(newData, newTransaksi);
    setInputJumlah('');
    setMenu('utama');
    Alert.alert('Sukses', `✅ Berhasil mencatat produksi ${jumlah} es batu!`);
  };

  const handleKeras=()=>{
    const jumlah=parseInt(inputJumlah);
    if (isNaN(jumlah)||jumlah<=0) {
      Alert.alert('Error', 'Jumlah harus angka positif!');
      return;
    }

    const maxBisaKeras=data.totalProduksi - data.totalKeras - data.totalTerjual;
    if (jumlah > maxBisaKeras) {
      Alert.alert('Error', `Es cair hanya tersisa ${maxBisaKeras} buah!`);
      return;
    }

    const newData={
      ...data,
      totalKeras:data.totalKeras + jumlah,
    };
    const newTransaksi=tambahTransaksi(
      'keras',
      jumlah,
      `${jumlah} es batu menjadi keras (siap jual)`
    );
    setData(newData);
    saveData(newData, newTransaksi);
    setInputJumlah('');
    setMenu('utama');
    Alert.alert('Sukses', `✅ ${jumlah} es batu menjadi keras!`);
  };

  const handlePenjualan = () => {
    const jumlah = parseInt(inputJumlah);
    if (isNaN(jumlah) || jumlah <= 0) {
      Alert.alert('Error', 'Jumlah harus angka positif!');
      return;
    }

    if (jumlah > data.totalKeras) {
      Alert.alert('Error', `Stok tidak cukup! Tersedia: ${data.totalKeras} buah`);
      return;
    }

    const pendapatan = (jumlah / 4) * 5000;
    const newData = {
      ...data,
      totalKeras: data.totalKeras - jumlah,
      totalTerjual: data.totalTerjual + jumlah,
      uangTersimpan: data.uangTersimpan + pendapatan,
    };
    const newTransaksi = tambahTransaksi(
      'penjualan',
      jumlah,
      `Terjual ${jumlah} es = ${jumlah/4} bungkus @Rp5.000 = Rp${pendapatan.toLocaleString()}`
    );
    setData(newData);
    saveData(newData, newTransaksi);
    setInputJumlah('');
    setMenu('utama');
    Alert.alert('Sukses', `💰 Pendapatan: Rp ${pendapatan.toLocaleString()}`);
  };

  const handleSetorUang = () => {
    const jumlah = parseInt(inputJumlah);
    if (isNaN(jumlah) || jumlah <= 0) {
      Alert.alert('Error', 'Jumlah harus angka positif!');
      return;
    }

    const newData = {
      ...data,
      uangTersimpan: data.uangTersimpan + jumlah,
    };
    const newTransaksi = tambahTransaksi(
      'setorUang',
      jumlah,
      `Menambahkan uang tersimpan Rp${jumlah.toLocaleString()}`
    );
    setData(newData);
    saveData(newData, newTransaksi);
    setInputJumlah('');
    setMenu('utama');
    Alert.alert('Sukses', `🏦 Uang tersimpan: Rp ${newData.uangTersimpan.toLocaleString()}`);
  };

  const totalPendapatan = (data.totalTerjual / 4) * 5000;
  const totalCair = data.totalProduksi - data.totalKeras - data.totalTerjual;

  // ============ RENDER UI ============
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🧊 Manajemen Es Batu</Text>
        <Text style={styles.subtitle}>Harga: Rp 5.000 / 4 es</Text>
      </View>

      {/* Menu Utama */}
      {menu === 'utama' && (
        <ScrollView style={styles.menuContainer}>
          <TouchableOpacity style={styles.card} onPress={() => setMenu('produksi')}>
            <Text style={styles.cardEmoji}>📦</Text>
            <Text style={styles.cardText}>Buat Es Batu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => setMenu('keras')}>
            <Text style={styles.cardEmoji}>❄️</Text>
            <Text style={styles.cardText}>Catat Es Keras</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => setMenu('jual')}>
            <Text style={styles.cardEmoji}>💰</Text>
            <Text style={styles.cardText}>Catat Penjualan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => setMenu('setor')}>
            <Text style={styles.cardEmoji}>🏦</Text>
            <Text style={styles.cardText}>Catat Uang Tersimpan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => setMenu('statistik')}>
            <Text style={styles.cardEmoji}>📊</Text>
            <Text style={styles.cardText}>Lihat Statistik</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => setMenu('riwayat')}>
            <Text style={styles.cardEmoji}>📜</Text>
            <Text style={styles.cardText}>Lihat Riwayat</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Menu Produksi */}
      {menu === 'produksi' && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>📦 Buat Es batu</Text>
          <TextInput
            style={styles.input}
            placeholder="Jumlah es yang dibuat"
            keyboardType="numeric"
            value={inputJumlah}
            onChangeText={setInputJumlah}
          />
          <TouchableOpacity style={styles.button} onPress={handleProduksi}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCancel} onPress={() => setMenu('utama')}>
            <Text style={styles.buttonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Menu Keras */}
      {menu === 'keras' && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>❄️ Catat Es Keras</Text>
          <Text style={styles.infoText}>Es cair tersisa: {totalCair} buah</Text>
          <TextInput
            style={styles.input}
            placeholder="Jumlah yang sudah keras"
            keyboardType="numeric"
            value={inputJumlah}
            onChangeText={setInputJumlah}
          />
          <TouchableOpacity style={styles.button} onPress={handleKeras}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCancel} onPress={() => setMenu('utama')}>
            <Text style={styles.buttonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Menu Penjualan */}
      {menu === 'jual' && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>💰 Catat Penjualan</Text>
          <Text style={styles.infoText}>Stok es keras: {data.totalKeras} buah</Text>
          <TextInput
            style={styles.input}
            placeholder="Jumlah yang terjual"
            keyboardType="numeric"
            value={inputJumlah}
            onChangeText={setInputJumlah}
          />
          <TouchableOpacity style={styles.button} onPress={handlePenjualan}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCancel} onPress={() => setMenu('utama')}>
            <Text style={styles.buttonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Menu Setor Uang */}
      {menu === 'setor' && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>🏦 Catat Uang Tersimpan</Text>
          <Text style={styles.infoText}>Uang saat ini: Rp {data.uangTersimpan.toLocaleString()}</Text>
          <TextInput
            style={styles.input}
            placeholder="Jumlah uang yang disetor"
            keyboardType="numeric"
            value={inputJumlah}
            onChangeText={setInputJumlah}
          />
          <TouchableOpacity style={styles.button} onPress={handleSetorUang}>
            <Text style={styles.buttonText}>Simpan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCancel} onPress={() => setMenu('utama')}>
            <Text style={styles.buttonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Menu Statistik */}
      {menu === 'statistik' && (
        <ScrollView style={styles.statContainer}>
          <Text style={styles.statTitle}>📊 STATISTIK</Text>
          <View style={styles.statBox}>
            <Text>🏭 Total es dibuat:</Text>
            <Text style={styles.statValue}>{data.totalProduksi} buah</Text>
          </View>
          <View style={styles.statBox}>
            <Text>❄️ Es sudah keras:</Text>
            <Text style={styles.statValue}>{data.totalKeras} buah</Text>
          </View>
          <View style={styles.statBox}>
            <Text>💧 Es masih cair:</Text>
            <Text style={styles.statValue}>{totalCair} buah</Text>
          </View>
          <View style={styles.statBox}>
            <Text>💰 Total terjual:</Text>
            <Text style={styles.statValue}>{data.totalTerjual} buah</Text>
          </View>
          <View style={styles.statBox}>
            <Text>💵 Total pendapatan:</Text>
            <Text style={styles.statValue}>Rp {totalPendapatan.toLocaleString()}</Text>
          </View>
          <View style={styles.statBox}>
            <Text>🏦 Uang tersimpan:</Text>
            <Text style={styles.statValue}>Rp {data.uangTersimpan.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.buttonCancel} onPress={() => setMenu('utama')}>
            <Text style={styles.buttonText}>Kembali</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Menu Riwayat */}
      {menu === 'riwayat' && (
        <ScrollView style={styles.riwayatContainer}>
          <Text style={styles.statTitle}>📜 RIWAYAT TRANSAKSI</Text>
          {transaksi.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada transaksi</Text>
          ) : (
            transaksi.map((item) => (
              <View key={item.id} style={styles.riwayatItem}>
                <Text style={styles.riwayatWaktu}>{item.waktu}</Text>
                <Text style={styles.riwayatKeterangan}>{item.keterangan}</Text>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.buttonCancel} onPress={() => setMenu('utama')}>
            <Text style={styles.buttonText}>Kembali</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}


