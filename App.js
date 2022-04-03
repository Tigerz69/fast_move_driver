import * as React from 'react';
import { Text, View, StyleSheet,LogBox } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './pages/Splash'
import Login from './pages/Login'
import Recover from './pages/Recover'
import Register from './pages/Registration'
import Account from './pages/Account'
import Edit from './pages/Edit'
import Finding from './pages/Finding';
import ExtendDetail from './pages/ExtendDetail';
import History from './pages/History';
import Chat from './pages/Chat'
import CurrentJob from './pages/CurrentJob';
import SuccessJob from './pages/SuccessJob';
import CancelJob from './pages/CancelJob';
import FullDetail from './pages/FullDetail'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import configureStore from './Store'
import {Provider} from 'react-redux'

const SplashScreen=({navigation})=>(
  <Splash navigation={navigation}/>
)

const LoginScreen=({navigation})=>(
  <Login navigation={navigation}/>
)

const RecoverScreen=({navigation})=>(
  <Recover navigation={navigation}/>
)

const RegisterScreen=({navigation})=>(
  <Register navigation={navigation}/>
)

const AccountScreen=({navigation})=>(
  <Account navigation={navigation}/>
)

const EditScreen=({navigation})=>(
  <Edit navigation={navigation}/>
)

const FindingScreen=({navigation})=>(
  <Finding navigation={navigation}/>
)

const ExtendDetailScreen=({navigation,route})=>(
  <ExtendDetail navigation={navigation} route={route}/>
)
const HistoryScreen=({navigation})=>(
  <History navigation={navigation}/>
)

const CurrentJobScreen=({navigation})=>(
  <CurrentJob navigation={navigation}/>
)

const SuccessJobScreen=({navigation})=>(
  <SuccessJob navigation={navigation}/>
)

const CancelJobScreen=({navigation})=>(
  <CancelJob navigation={navigation}/>
)

const FullDetailScreen=({navigation,route})=>(
  <FullDetail navigation={navigation}route={route}/>
)

const ChatScreen=({navigation})=>(
  <Chat navigation={navigation}/>
)


LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]);
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Warning: Each child']);
LogBox.ignoreLogs(['Warning: Cannot update a component']);


  

const TopTab = createMaterialTopTabNavigator();
const MyTopTabs=()=>{
  return(
    <TopTab.Navigator>
        <TopTab.Screen name="Current Job" component={CurrentJobScreen} />
        <TopTab.Screen name="Success Job" component={SuccessJobScreen} />
        
        
        <TopTab.Screen name="Cancel Job" component={CancelJobScreen} />
    </TopTab.Navigator>
  )
}



const Tab = createBottomTabNavigator();

const MyTabs=()=> {
  return (
    
      <Tab.Navigator>
        <Tab.Screen name="Finding" component={FindingScreen} options={{headerStyle:{backgroundColor: '#457B9D'},tabBarLabel: 'Finding',headerTitleStyle: { color: 'white' },
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="find" size={21} color="black" />
          ),}} />

        <Tab.Screen name="History" component={MyTopTabs} options={{headerStyle:{backgroundColor: '#457B9D'},tabBarLabel: 'History',headerTitleStyle: { color: 'white' },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={28} color="black" />
          ),}} />
        
        
        <Tab.Screen name="Account" 
        component={AccountScreen} options={{headerStyle:{backgroundColor: '#457B9D'},tabBarLabel: 'Account',headerTitleStyle: { color: 'white' },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" size={28} color="black" />
          ),}} />
      </Tab.Navigator>
    
   
  );
}


const Stack = createStackNavigator();
const MyStack = ()=>(
  <Stack.Navigator>
    <Stack.Screen name='Splash' component={SplashScreen} options={{headerShown:false}}/>
    <Stack.Screen 
      name='Register' 
      component={RegisterScreen} 
      options={{ headerStyle: {backgroundColor: '#457B9D'},headerTintColor: 'white'}}/>
    <Stack.Screen 
      name='Recover' 
      component={RecoverScreen} 
      options={{ headerStyle: {backgroundColor: '#457B9D'},headerTintColor: 'white'}}/>
    
    <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
    <Stack.Screen name='ExtendDetail' component={ExtendDetailScreen} options={{headerShown:false}}/>
    <Stack.Screen name='MyTabs' component={MyTabs} options={{headerShown:false}}/>
    <Stack.Screen name='FullDetail' component={FullDetailScreen} options={{headerShown:false}}/>
    <Stack.Screen name='Chat' component={ChatScreen} options={{headerShown:false}}/>
  </Stack.Navigator>
)

export default function App() {
  return (
    <Provider store={configureStore}>
      <NavigationContainer >
        {<MyStack />}
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'pink',
    padding: 8,
  }
});
