import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';
import { Card,Avatar,Title,Paragraph } from 'react-native-paper';

import auth from "../Firebase/Auth"
import 'firebase/firestore';
import firebase from 'firebase';
class ExtendDetail extends Component {
  constructor(props){
    super(props);
    this.db = firebase.firestore();
     this.state = {
       
    };
  }
  
  componentDidMount() {
   
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
              
              
              {text: 'Ok', onPress:() => this.props.navigation.navigate('MyTabs')}
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
                //<Paragraph>{`เบอร์ติดต่อ : `+item.wayPointList[i].phonenumber}</Paragraph>
            )
        }
    //console.log(route.params.item,route.params.num)
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,marginTop: StatusBar.currentHeight || 0}}>
            
            <Card 
              >
                <Card.Title title={item.distance+" Km     "+time} 
                />
                <Card.Content>
                  <Title>ลำดับจุดส่ง</Title>
                  {arr}
                  <Paragraph>{"หมายเหตุ : "+item.detail}</Paragraph>
                  <Paragraph>{"ราคา : "+item.price} </Paragraph>
                  
                </Card.Content>
                <Card.Actions style={{justifyContent:'center',marginTop:10}}>
                  
                  <TouchableOpacity style={styles.button} onPress={()=>this.showAlertConfirm(item.id)}  ><Text>รับงาน</Text>
                  </TouchableOpacity>
                </Card.Actions>
                
            </Card>
    
            
          


        </View>
    );
  }
}

const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    borderRadius:20,
    backgroundColor:'#A8DADC',
    justifyContent:'center',
    alignItems:'center',
   
  }
  
});


export default ExtendDetail;