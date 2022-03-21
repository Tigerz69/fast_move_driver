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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]);
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Warning: Each child']);
LogBox.ignoreLogs(['Warning: Cannot update a component']);

const Drawer = createDrawerNavigator();
const MyDrawer=()=> (
  <Drawer.Navigator>
  
     <Drawer.Screen  
        name="Show" 
        component={AccountScreen}
        options={{ headerStyle: {backgroundColor: 'pink'},headerTintColor: 'white'}}/> 

   {/* <Drawer.Screen  
        name="Edit" 
        component={EditScreen} 
    options={{ headerStyle: {backgroundColor: '#6b4683'},headerTintColor: 'white'}}/>*/}
    <Drawer.Screen
        name="Finding"
        component={FindingScreen}
        options={{ headerStyle: {backgroundColor: 'pink'},headerTintColor: 'white'}}/>

  </Drawer.Navigator>
  
)

// const Tab = createBottomTabNavigator();
// const TopTab = createMaterialTopTabNavigator();
// function MyTabs() {
//   return (
    
//       <Tab.Navigator>
//         <Tab.Screen name="Finding" component={FindingScreen} />
//         <Tab.Screen name="History" component={HistoryScreen} />
//         <Tab.Screen name="Setting" component={EditScreen} />
//       </Tab.Navigator>
    
   
//   );
// }


const Stack = createStackNavigator();
const MyStack = ()=>(
  <Stack.Navigator>
    <Stack.Screen name='Splash' component={SplashScreen} options={{headerShown:false}}/>
    <Stack.Screen 
      name='Register' 
      component={RegisterScreen} 
      options={{ headerStyle: {backgroundColor: 'pink'},headerTintColor: 'white'}}/>
    <Stack.Screen 
      name='Recover' 
      component={RecoverScreen} 
      options={{ headerStyle: {backgroundColor: 'pink'},headerTintColor: 'white'}}/>
    <Stack.Screen name='DrawerTab' component={MyDrawer} options={{headerShown:false}}/>
    <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
    <Stack.Screen name='ExtendDetail' component={ExtendDetailScreen} options={{headerShown:false}}/>
    
    
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
