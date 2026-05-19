import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigasiRoot } from "../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import { FontAwesome } from "@expo/vector-icons";

export default function Home(){
  const navigasi=useNavigation<StackNavigationProp<NavigasiRoot>>();
  const produksi=()=>{
    navigasi.navigate('Produksi');
  }
  const penjualan=()=>{
    navigasi.navigate('Penjualan');
  }
  const keras=()=>{
    navigasi.navigate('Keras');
  }
  const riwayat=()=>{
    navigasi.navigate('Riwayat');
  }
  const setor=()=>{
    navigasi.navigate('Setor');
  }
  const statistik=()=>{
    navigasi.navigate('Statistik');
  }
  return(
    <View style={styling.canvas}>
      <View style={styling.card}>
        <Text style={styling.cardTitle}>Welcome to EsBatu Management</Text>
        <View style={styling.section}>
          <BlurView intensity={4} tint="light" style={styling.sectionOne}>
            <FontAwesome name="home" size={120} color="#fff"/>
          </BlurView>
          <TouchableOpacity
            onPress={produksi}
            activeOpacity={0.8}
            style={styling.button}
          >
            <Text style={styling.buttonText}>Produksi Es Batu</Text>
            <FontAwesome name="arrow-right" size={18} color="#fff"/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={penjualan}
            activeOpacity={0.8}
            style={styling.button}
          >
            <Text style={styling.buttonText}>Penjualan Es Batu</Text>
            <FontAwesome name="arrow-right" size={18} color="#fff"/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={keras}
            activeOpacity={0.8}
            style={styling.button}
          >
            <Text style={styling.buttonText}>Catat yang sudah keras</Text>
            <FontAwesome name="arrow-right" size={18} color="#fff"/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={riwayat}
            activeOpacity={0.8}
            style={styling.button}
          >
            <Text style={styling.buttonText}>Riwayat Penjualan</Text>
            <FontAwesome name="arrow-right" size={18} color="#fff"/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={setor}
            activeOpacity={0.8}
            style={styling.button}
          >
            <Text style={styling.buttonText}>Setor Es Batu</Text>
            <FontAwesome name="arrow-right" size={18} color="#fff"/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={statistik}
            activeOpacity={0.8}
            style={styling.button}
          >
            <Text style={styling.buttonText}>Statistik</Text>
            <FontAwesome name="arrow-right" size={18} color="#fff"/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styling=StyleSheet.create({
  canvas:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#e0e7ff'
  },
  card:{
    height:'auto',
    width:290,
    padding:20,
    margin:8,
    borderRadius:25,
    backgroundColor:'#192f6a',
    elevation:15,
    shadowColor:'#000',
    shadowOffset:{width:0,height:5},
    shadowOpacity:0.3,
    shadowRadius:6,
    marginBottom:10 
  },
  cardTitle:{
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize:26,
    marginTop:10,
    marginBottom:10
  },
  section:{
    marginTop:25,
    justifyContent:'center',
    alignItems:'center',
  },
  subtitle:{
    color:'#fff',
    textAlign:'center',
    fontSize:14,
    marginTop:20,
    marginBottom:20,
    paddingHorizontal:10
  },
  sectionOne:{
    padding:25,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:60,
  },
  button:{
    flexDirection:'row',
    backgroundColor:'#ff7b00',
    paddingVertical:12,
    paddingHorizontal:25,
    borderRadius:30,
    alignItems:'center',
    justifyContent:'center',
    gap:10,
    width:'80%',
    marginTop:'3%',
    marginBottom:15
  },
  buttonText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:16
  },
});
