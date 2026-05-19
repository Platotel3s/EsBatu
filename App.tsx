import { NavigationContainer } from "@react-navigation/native";
import Home from "./screen/Home";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Produksi from "./screen/Produksi";
import { createStackNavigator } from '@react-navigation/stack';
import Penjualan from "./screen/Penjualan";
import Keras from "./screen/Keras";
import Setor from "./screen/Setor";
import Statistik from "./screen/Statistik";
import Riwayat from "./screen/Riwayat";

export type NavigasiRoot={
  Home:undefined;
  Keras:undefined;
  Penjualan:undefined;
  Produksi:undefined;
  Riwayat:undefined;
  Setor:undefined;
  Statistik:undefined;
}
const Stack=createStackNavigator<NavigasiRoot>();

export default function App(){
  return(
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle:{
              backgroundColor:'#192f6a'
            },
            headerTintColor:'#fff',
            headerTitleStyle:{
              fontWeight:'bold'
            },
            headerShown:false
          }}
        >
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
          <Stack.Screen name="Produksi" component={Produksi} options={{headerShown:false}}/>
          <Stack.Screen name="Penjualan" component={Penjualan} options={{headerShown:false}}/>
          <Stack.Screen name="Keras" component={Keras} options={{headerShown:false}}/>
          <Stack.Screen name="Riwayat" component={Riwayat} options={{headerShown:false}}/>
          <Stack.Screen name="Setor" component={Setor} options={{headerShown:false}}/>
          <Stack.Screen name="Statistik" component={Statistik} options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
