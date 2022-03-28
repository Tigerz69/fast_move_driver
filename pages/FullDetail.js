import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  Linking,
  ScrollView
} from 'react-native';
import { Card,Avatar,Title,Paragraph } from 'react-native-paper';
import getDirections from 'react-native-google-maps-directions'
import auth from "../Firebase/Auth"
import 'firebase/firestore';
import firebase from 'firebase';
import { Ionicons } from "@expo/vector-icons"

class FullDetail extends Component {
  constructor(props){
    super(props);
    this.db = firebase.firestore();
     this.state = {
       cusName:null,
       phonenumber:""
    };
  }
  
  call=()=>{
    const { phoneNumber } = this.state

    Linking.openURL(`tel:${phoneNumber}`)
  }
  componentDidMount() {
    const {route} =this.props
    const item=route.params.item
    this.renderName(item.customerID)

  }

  acceptWork=(id)=>{
    let user = auth.getCurrentUser() 
    let driverid = user.uid
    var queryWork= this.db.collection("orders").where("id","==",id).where("status","==","matched");
    queryWork.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            this.db.collection("orders").doc(doc.id).set({
              
              status: "success",
              
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
  showAlertConfirm(id) {  
    Alert.alert(  
      'Are you sure to success the job',  
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
        'You got it done',  
        [  
              
              
              {text: 'Ok', onPress:() => this.props.navigation.navigate('MyTabs')}
        ]  
    );  
  }  
  Unsuccess(){
    Alert.alert(  
      'Error',  
        '',  
        [  
              
              
              {text: 'Ok', onPress: () => console.log('Ok Pressed')} 
        ]  
    );  
  }
  onPressChat=()=>{

        
    this.props.navigation.navigate('Chat');
  
  }
  renderName=(cusID)=>{
    let name
    this.db.collection("users").doc(cusID).get().then((doc) => {
        if (doc.exists) {
            console.log('tumaiiiii')
            let first = doc.data().firstname
            let last = doc.data().lastname
            //console.log(first)
            //console.log(last)

            name=first+"    "+last
            console.log('name',name)
            this.setState({phoneNumber:doc.data().phone})
            this.setState({cusName:name})
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    
   
  }
  handleGetDirections = (item) => {
    const data = {
       source: undefined,
      destination: {
        latitude: item.region.latitude,
        longitude:  item.region.longitude
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ],
      waypoints: [
        // {
        //   latitude: -33.8600025,
        //   longitude: 18.697452
        // },
        // {
        //   latitude: -33.8600026,
        //   longitude: 18.697453
        // },
        //    {
        //   latitude: -33.8600036,
        //   longitude: 18.697493
        // }
      ]
    }

    getDirections(data)
  }

  render(props) {
    const { navigation } = this.props;
    const {route} =this.props
    const item=route.params.item
    const num = route.params.num
    const time = route.params.time
    let arr=[]
    for(let i=0;i<num;i++)
        {
            arr.push(
                <Paragraph>{`จุดที่ ${i+1} `+item.wayPointList[i].address}</Paragraph>,
                <Paragraph>{`รายละเอียดงาน : `+item.wayPointList[i].details}</Paragraph>,
                <Paragraph>{`เบอร์ติดต่อ : `+item.wayPointList[i].phonenumber}</Paragraph>,
                <TouchableOpacity style={styles.button} onPress={()=>this.handleGetDirections(item.wayPointList[i])}>
                    <Text >{`จุดที่ ${i+1} `}</Text>
                  </TouchableOpacity>
            )
        }
    //console.log(route.params.item,route.params.num)
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,marginTop: StatusBar.currentHeight || 0}}>
            <ScrollView>
            <Card 
              >
                <Card.Title title={item.distance+" Km     "+time} 
                />
                <Card.Content>
                  <Title>ลำดับจุดส่ง</Title>
                  {arr}
                  <Paragraph>{"หมายเหตุ : "+item.detail}</Paragraph>
                  <Paragraph>{"ข้อมูลผู้ติดต่อ : "+this.state.cusName}</Paragraph>
                  <Paragraph>{"ราคา : "+item.price} </Paragraph>
                  
                </Card.Content>
                <Card.Actions style={{flexDirection:'column'}}>
                <View style={styles.containerPhone}>
                    <TextInput 
                      onChangeText={(text)=>this.setState({phoneNumber:text})}
                      style={styles.input} 
                      placeholder={this.state.phonenumber} 
                      keyboardType="number-pad"/>
                      <TouchableOpacity 
                        
                        
                        onPress={this.onPressChat}>
                          <Ionicons name="ios-chatbubble-sharp" size={24} color="black" style={styles.callTxt} />
                      </TouchableOpacity >
                    <TouchableOpacity onPress={()=> this.call()}>
                      <Ionicons name="ios-call" style={styles.callTxt}/>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.button} onPress={()=>this.showAlertConfirm(item.id)}  ><Text style={styles.button}>ขนส่งสำเร็จ</Text>
                  </TouchableOpacity>
                  
                </Card.Actions>
                
            </Card>
    
            
          

            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  
  input:{
    height:50,
    fontSize:40,
    color:"#000",
    marginBottom:20
  },
  callTxt:{
    backgroundColor:"#42b883",
    padding:10,
    borderRadius:30,
    width:80,
    textAlign:"center",
    color:"#fff",
    fontSize:30
  },
  containerPhone:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    margin:10,
    padding:10
  }
  
});


export default FullDetail;