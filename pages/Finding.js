//Matching.js
import {View,Text,StatusBar,FlatList,Alert,useState,RefreshControl,Button,TouchableOpacity,StyleSheet } from 'react-native';
import React,{Component} from "react";
//import firebase from "../Firebase/Initial";
import 'firebase/firestore';
import 'firebase/database'
import 'firebase/auth';
import auth from "../Firebase/Auth"
import firebase from 'firebase';
import 'firebase/firestore';
//import firestore from '@react-native-firebase/firestore';
import { Card,Avatar,Title,Paragraph } from 'react-native-paper';
import * as Location from 'expo-location';
import firestore from '../Firebase/Firestore'
import * as TaskManager from "expo-task-manager";
import axios from 'axios';
import Loading from './Loading';

const LOCATION_TASK_NAME = "background-location-task";
const apiKey="AIzaSyCfjk1u2VcAvNfK31VMN581MMNePvR2J-k";
const Distance_URL="https://maps.googleapis.com/maps/api/distancematrix/json"

var updateLo = null

class Finding extends Component{
    constructor(props){
        super(props);
        this.db = firebase.firestore();
        this.rldb=firebase.database();
        this.state = {
         orders:null,
         selectedID:null,
         region:null,
         errorMsg:null,
         loading:false,
         updateLo:false,
         promises:[],
         refreshing:false,
         location:null,
         errorMessage: null,
         locationloaded: false,
         
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
      this._getLocationAsync()
      .then(() => firebase.firestore().collection("orders").where("status","==","unmatch").get().then((querySnapshot) => {
        
        let orders = [];
        console.log('before foreach')
        querySnapshot.forEach((doc) => {
            console.log('id doc',doc.id)
            console.log('location from local',this.state.location)
            //console.log(doc.data()) 
              let loc = this.state.location
              console.log(loc)
              if(loc&&loc.coords){
                let orilat=loc.coords.latitude
                let orilng=loc.coords.longitude
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
                  }
                  this.setState({orders:orders})
    
                }).catch(function (error) {
                  console.log(error);
                })

              }else{
                this.AlertReOpenApp()
              }
            
        })  
           
        
        // Promise.all(this.state.promises).then(function(data){
        //   that.setState({orders:orders})
        //   console.log("orders list",that.state.orders)
        // })   
        
      }),
        this.setState({refreshing:false},
        console.log('orders in list state',this.state.orders),
        this.updateLocationToRealTime()
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
              
              
              {text: 'Ok', onPress: () => this.props.navigation.navigate('MyTabs')} 
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
              firestore.addMessageRoom(
                (id) => {
                  
                  //console.log('id in redux',this.props.user.id)
                  firestore.addChat(
                    doc.id,
                    id,
                    () => {},
                    (error) => {}
                  );
                  
                  
                  
                },
                (error) => {
                  console.log(error);
                }
              )
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
    // renderItem=({item})=>{

        
    
    //     let num =item.gnome.length
    //     let arr=[]
    //     for(let i=0;i<num;i++)
    //     {
    //         arr.push(
    //             <Paragraph>{`จุดที่ ${i+1} `+item.wayPointList[i].address}</Paragraph>
    //         )
    //     }
    //     return(
    //         <View style={{padding:8}}>
    //           <Card 
    //           >
    //             <Card.Title title={item.distance+" Km     "+this.renderTime(item.getTime)} 
    //             />
    //             <Card.Content>
    //               <Title>ลำดับจุดส่ง</Title>
    //               {arr}
    //               <Paragraph>{"ราคา : "+item.price} </Paragraph>
                  
    //             </Card.Content>
    //             <Card.Actions style={{justifyContent:'space-between'}}>
    //               <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('ExtendDetail',{item:item,num:num,time:this.renderTime(item.getTime)})}><Text>เพิ่มเติม</Text>
    //               </TouchableOpacity> 
    //               <TouchableOpacity style={styles.button} onPress={() =>this.showAlertConfirm(item.id)}  ><Text>รับงาน</Text>
    //               </TouchableOpacity>
    //             </Card.Actions>
                
    //           </Card>
    
    //         </View>
        
    //     );
    //   }
      renderSeperator=()=>{
        return(
          <View style={{height:1,backgroundColor:'#dddddd'}}>
          </View>
        );
      }
      renderHeader=()=>{
        return(
          <View style={{alignItems:'center'}}>
              
              <Text style={{color:'gray'}} >pull to refresh</Text></View>
        
        );
      }
      renderTime=(time)=>{
        console.log('time',time)
        
          let tempdate = new Date(time.seconds*1000+ time.nanoseconds / 1000000)
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
          //return tempdate
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
    _getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status)
      if (status !== 'granted') {
        
          console.log('Permission to access location was denied')
         
        
      } else {
        console.log('in else')
        Location.hasServicesEnabledAsync().then((data)=>{
          console.log('service: ',data)
        })
        // only check the location if it has been granted
        // you also may want to wrap this in a try/catch as async functions can throw
        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true  })
        .catch((error) => {
          console.log("get current location has problem", error);
        });
        this.setState({location})
        let backPerm = await Location.requestBackgroundPermissionsAsync();
        console.log(backPerm);
        
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
          }).then(res=>{
            console.log("success")
          }).
        catch(error=>{
          console.error(error)
          this.AlertReOpenApp()
        })
        
      }
    };
    
    
    componentWillUnmount=()=>{
      this.ordersListener();
    }

    AlertReOpenApp() {  
      Alert.alert(  
        'Error',  
          'Please reopen application, The location not properly',  
          [  
                
                {text: 'OK', onPress: () => console.log('OK Pressed')},  
          ]  
      );  
    } 

    componentDidMount=()=>{
        // Asking for device location permission
      this._getLocationAsync().then(
        ()=>setInterval(()=>{
        this.updateLocationToRealTime()  
      },15000))
      this.ordersListener=this.db.collection("orders").where("status","==","unmatch").onSnapshot((querySnapshot) => {

              let orders=[];
              querySnapshot.forEach((doc) => {
                  console.log('id doc',doc.id)
                  console.log('location from local',this.state.location)
                  //console.log(doc.data()) 
                    let loc = this.state.location
                    console.log(loc)
                    if(loc&&loc.coords){
                      let orilat=loc.coords.latitude
                      let orilng=loc.coords.longitude
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
                        }
                        this.setState({orders:orders})
          
                      }).catch(function (error) {
                        console.log(error);
                      })
    
                    }else{
                      this.AlertReOpenApp()
                    }
                    
              
              })  
             
          
          // Promise.all(this.state.promises).then(function(data){
          //   that.setState({orders:orders})
          //   console.log("orders list",that.state.orders)
          // })   
          
      })
      
      
      
      
    }

    // updateLocationToRealTime=()=>{
    //   let user=auth.getCurrentUser()
    //   let uid = user.uid
    //   axios.get(`https://fast-move-or-something-diff.as.r.appspot.com/getLocation`)  
    //       .then(res => {  
    //         let data = res.data; 
            
    //         console.log('data from api that get',data) 
    //         // this.setState({distance:data["distance"]})
    //         // this.setState({duration:data["duration"]})
    //         // this.setState({gnome:data["gnome"]})
           
    //             this.rldb.ref('users/'+uid).set(
    //               data.location
    //             )
            
            
            
    //       })
      

    // }

    updateLocationToRealTime=()=>{
      let user=auth.getCurrentUser()
      let uid = user.uid
      
          
            
      console.log('data from api that return from post',updateLo) 
            // this.setState({distance:data["distance"]})
            // this.setState({duration:data["duration"]})
            // this.setState({gnome:data["gnome"]})
           
                this.rldb.ref('users/'+uid).set(
                  updateLo
                )
            
            
            
        
      

    }
    
      
      
    
  


    render(){
        return(
                <View style={{paddingTop:StatusBar.currentHeight,flex:1}}>
                    
                    <FlatList
                        data={this.state.orders}
                        renderItem={({ item }) =>{
                        let num =item.gnome.length
                        console.log('item wayPoint',item)
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
                        
                        )
      
              
                      }}
                        ItemSeparatorComponent={this.renderSeperator}
                        ListHeaderComponent={this.renderHeader}
                        refreshControl={
                          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                        }

                        keyExtractor={(item)=>item.id}
                        
                        ref={(ref)=>{this.myRef=ref}}
                    />
                    
                </View>
            )
        
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
    var sendLocation = {
      method: 'post',
      url: `https://fast-move-or-something-diff.as.r.appspot.com/sendLocation`,

      data: temp
    };
    
    axios(sendLocation)
    .then(function (response) {
        console.log('success send location')
        
        updateLo=response.data.location
      }).catch(function (error) {
        console.log(error);
      });
    
    console.log("locations", temp);
  }
});

const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    borderRadius:20,
    backgroundColor:'#A8DADC',
    justifyContent:'center',
    alignItems:'center'
    
  }
  
});


export default Finding