//Matching.js
import {View,Text,StatusBar,FlatList,Alert,useState,RefreshControl,Button,TouchableOpacity,StyleSheet } from 'react-native';
import React,{Component} from "react";
import firebase from "../Firebase/Initial";
import 'firebase/firestore';
import 'firebase/database'
import 'firebase/auth';
import auth from "../Firebase/Auth"

//import firestore from '@react-native-firebase/firestore';
import { Card,Avatar,Title,Paragraph } from 'react-native-paper';
import * as Location from 'expo-location';

import * as TaskManager from "expo-task-manager";
import axios from 'axios';
import Loading from './Loading';

const LOCATION_TASK_NAME = "background-location-task";
const apiKey="AIzaSyCfjk1u2VcAvNfK31VMN581MMNePvR2J-k";
const Distance_URL="https://maps.googleapis.com/maps/api/distancematrix/json"
var location=null



class Finding extends Component{
    constructor(props){
        super(props);
        this.db = firebase.firestore();
        
        this.state = {
         orders:null,
         selectedID:null,
         region:null,
         errorMsg:null,
         loading:false,
         updateLo:false,
         promises:[],
         refreshing:false
        };
         
    }
    // onResult=(QuerySnapshot)=> {
    //     console.log('Got orders collection result.');
    // }
      
    // onError=(error)=> {
    //     console.error(error);
    // }
    
  
    onRefresh =  () => {
     this.setState({refreshing:true})

     firebase.firestore().collection("orders").where("status","==","unmatch").orderBy("getTime", "asc").get().then((querySnapshot) => {
      //var that = this
      let orders = [];
      console.log('before foreach')
      querySnapshot.forEach((doc) => {
          console.log('location from global',location)
          //console.log(doc.data())

            let orilat=location.latitude
            let orilng=location.longitude
            let deslat=doc.data().wayPointList[0].region.latitude
            let deslng=doc.data().wayPointList[0].region.longitude

            let config = {
              method: 'get',
              url: `${Distance_URL}?origins=${orilat}%2C${orilng}&destinations=${deslat}%2C${deslng}&key=${apiKey}`,
              headers:{}
            };

            axios(config).then((response)=>{
              let data_temp =(JSON.parse(JSON.stringify(response.data)))
              console.log(data_temp);
              if(data_temp.rows[0].elements[0].distance.value<=10000){
                orders.push(doc.data()); 
                this.setState({orders:orders})
                
              }else{
                this.setState({orders:orders})
              }

            }).catch(function (error) {
              console.log(error);
            })
          
          
          
      
      // Promise.all(this.state.promises).then(function(data){
      //   that.setState({orders:orders})
      //   console.log("orders list",that.state.orders)
      // })   
      
      });
      //console.log("Current orders: ", orders.join(", "));
      
    }).then(() => this.setState({refreshing:false},
      console.log('orders in list state',this.state.orders)
      ))

  }

  showAlertConfirm(id) {  
    Alert.alert(  
      'Are you sure to accept this job',  
        '',  
        [  
              
              {text: 'Yes', onPress: () => this.acceptWork(id)}, 
              {text: 'No', onPress: () => console.log('No Pressed')} 
        ]  
    );  
  }  
  Success() {  
    Alert.alert(  
      'Success',  
        'You got this job',  
        [  
              
              
              {text: 'Ok', onPress: () => console.log('Ok Pressed')} 
        ]  
    );  
  }  
  Unsuccess(){
    Alert.alert(  
      'Unsuccess',  
        'no job or this job already matched',  
        [  
              
              
              {text: 'Ok', onPress: () => console.log('Ok Pressed')} 
        ]  
    );  
  }
    
    
    acceptWork=(id)=>{
      let user = auth.getCurrentUser() 
      let driverid = user.uid
      var queryWork= this.db.collection("orders").where("id","==",id).where("status","==","unmatch");
      queryWork.get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.db.collection("orders").doc(doc.id).set({
                driverID: driverid,
                status: "matched",
                
            },{merge:true})
            .then(() => {
                this.Success()
                console.log("Document successfully written!");
            })
            .catch((error) => {
                this.Unsuccess()
                console.error("Error writing document: ", error);
            });
          });
      })
      .catch((error) => {
        this.Unsuccess()
          console.log("Error getting documents: ", error);
      });
        
            
            
        
    }

    onItemPress=(id)=>{
        this.setState({selectedID:id})
        console.log(id)
      }
    renderItem=({item})=>{

        
    
        let num =item.gnome.length
        let arr=[]
        for(let i=0;i<num;i++)
        {
            arr.push(
                <Paragraph>{`จุดที่ ${i+1} `+item.wayPointList[i].address}</Paragraph>
            )
        }
        return(
            <View style={{padding:8}}>
              <Card 
              >
                <Card.Title title={item.distance+" Km     "+this.renderTime(item.getTime)} 
                />
                <Card.Content>
                  <Title>ลำดับจุดส่ง</Title>
                  {arr}
                  <Paragraph>{"ราคา : "+item.price} </Paragraph>
                  
                </Card.Content>
                <Card.Actions style={{justifyContent:'space-between'}}>
                  <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('ExtendDetail',{item:item,num:num,time:this.renderTime(item.getTime)})}><Text>เพิ่มเติม</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity style={styles.button} onPress={() =>this.showAlertConfirm(item.id)}  ><Text>รับงาน</Text>
                  </TouchableOpacity>
                </Card.Actions>
                
              </Card>
    
            </View>
        
        );
      }
      renderSeperator=()=>{
        return(
          <View style={{height:1,backgroundColor:'#dddddd'}}>
          </View>
        );
      }
      renderHeader=()=>{
        return(
          <View style={{alignItems:'center'}}>
              
              <Text >pull to refresh</Text></View>
        
        );
      }
      renderTime=(time)=>{
          let tempdate = new Date(time)
          var date =tempdate.getDate()
          var month = tempdate.getMonth()+1
          var years = tempdate.getFullYear()
          var hour = tempdate.getHours()
          var minute = tempdate.getMinutes()
          if (hour < 10){
            hour = '0'+hour
          }
          
          if (minute < 10){
            minute = '0'+minute
          }
          return `${date}/${month}/${years}    ${hour}:${minute}`
      }

    calnum=(gnome)=>{
        let num = gnome.length
        return num
    }
    showAlert() {  
      Alert.alert(  
        'Error',  
          'Permission to access location was denied',  
          [  
                
                {text: 'OK', onPress: () => console.log('OK Pressed')},  
          ]  
      );  
    }  

    





    componentDidMount=async()=>{
        // Asking for device location permission
      const { status } = await Location.requestBackgroundPermissionsAsync();
      console.log(status)
      if (status !== 'granted') {
        this.showAlert()
      } else {
        console.log('in else')
        //this.setState({updateLo:true})
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.BestForNavigation ,
          timeInterval: 30000, //3min=180000
          //distanceInterval:1
        }).then(()=>{
          firebase.firestore().collection("orders").where("status","==","unmatch").orderBy("getTime", "asc").get().then((querySnapshot) => {
            var that = this
            let orders = [];
            console.log('before foreach')
            querySnapshot.forEach((doc) => {
                console.log('id doc',doc.id)
                console.log('location from global',location)
                //console.log(doc.data())
  
                  let orilat=location.latitude
                  let orilng=location.longitude
                  let deslat=doc.data().wayPointList[0].region.latitude
                  let deslng=doc.data().wayPointList[0].region.longitude
  
                  let config = {
                    method: 'get',
                    url: `${Distance_URL}?origins=${orilat}%2C${orilng}&destinations=${deslat}%2C${deslng}&key=${apiKey}`,
                    headers:{}
                  };
  
                  axios(config).then((response)=>{
                    let data_temp =(JSON.parse(JSON.stringify(response.data)))
                    console.log(data_temp);
                    if(data_temp.rows[0].elements[0].distance.value<=10000){
                      orders.push(doc.data()); 
                      this.setState({orders:orders})
                      
                    }
      
                  }).catch(function (error) {
                    console.log(error);
                  })
                
                
                
            
            // Promise.all(this.state.promises).then(function(data){
            //   that.setState({orders:orders})
            //   console.log("orders list",that.state.orders)
            // })   
            
            });
            //console.log("Current orders: ", orders.join(", "));
            
        })
        })
        //this.setState({updateLo:false})
      }
      // firebase.firestore().collection("test").where("temp","==","ok")
      // .onSnapshot((querySnapshot)=>{
      //   querySnapshot.forEach((doc) => {
      //     console.log(doc.data())
      //   })
      // })
      // firebase.firestore().collection("orders").onSnapshot((querySnapshot)=>{
      //   var orders=[];
      //   querySnapshot.forEach((doc)=>{
      //     console.log(doc.data())
      //     orders.push(doc.data())
      //     this.setState({orders:orders})
      //   })
      // })
      
      
      
      //subscriber();  //unsubscrib
       
    }
    


    render(){
        return(
                <View style={{paddingTop:StatusBar.currentHeight,flex:1}}>
                    
                    <FlatList
                        data={this.state.orders}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.renderSeperator}
                        ListHeaderComponent={this.renderHeader}
                        refreshControl={
                          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                        }

                        keyExtractor={(item)=>item.id}
                        
                        ref={(ref)=>{this.myRef=ref}}
                    />
                    
                </View>
            );
        
    }
    
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log("error", error);
    return;
  }
  if (data) {
    
    const { locations } = data;
    // do something with the locations captured in the background
    console.log(locations[0].coords)
    let templat = locations[0].coords.latitude;
    let templng = locations[0].coords.longitude
    let temp ={
      latitude:templat,
      longitude:templng
    }
    location=temp
    
    console.log("locations", temp);
  }
});

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  
});


export default Finding