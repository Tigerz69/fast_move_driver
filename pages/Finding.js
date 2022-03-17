//Matching.js
import {View,Text,StatusBar,FlatList} from 'react-native';
import React,{Component} from "react";
import firebase from "../Firebase/Initial";
import 'firebase/firestore';
import 'firebase/database'
//import firestore from '@react-native-firebase/firestore';
import { Card,Avatar,Title,Paragraph } from 'react-native-paper';


class Finding extends Component{
    constructor(props){
        super(props);
        this.db = firebase.firestore();
        this.state = {
         orders:null,
         selectedID:null
        };
         
    }
    // onResult=(QuerySnapshot)=> {
    //     console.log('Got orders collection result.');
    // }
      
    // onError=(error)=> {
    //     console.error(error);
    // }

    onItemPress=(id)=>{
        this.setState({selectedID:id})
        console.log(id)
      }
    renderItem=({item})=>{
        let num =this.calnum(item.gnome)
        let arr=[]
        for(let i=0;i<num;i++)
        {
            arr.push(
                <Paragraph>{`จุดที่ ${i+1} `+item.wayPointList[i].address}</Paragraph>
            )
        }
        return(
            <View style={{padding:8}}>
              <Card>
                <Card.Title title={item.distance+" Km     "+this.renderTime(item.getTime)} 
                />
                <Card.Content>
                  <Title>ลำดับจุดส่ง</Title>
                  {arr}
                  <Paragraph>{"ราคา : "+item.price} </Paragraph>
                  
                </Card.Content>
                
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
          <View>
              
              <Text>sup vro</Text></View>
        
        );
      }
      renderTime=(time)=>{
          tempdate = new Date(time)
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
    
    componentDidMount=()=>{
        //firestore().collection('orders').onSnapshot(onResult, onError);
        this.db.collection("orders")
        .onSnapshot((querySnapshot) => {
            var orders = [];
            querySnapshot.forEach((doc) => {
                //console.log(doc.data())
                orders.push(doc.data());
            });
            //console.log("Current orders: ", orders.join(", "));
            this.setState({orders:orders})
        });
    }



    render(){
        return(
                <View style={{paddingTop:StatusBar.currentHeight,flex:1}}>
                    
                    <FlatList
                        data={this.state.orders}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.renderSeperator}
                        ListHeaderComponent={this.renderHeader}
                        keyExtractor={(item)=>item.id}
                        ref={(ref)=>{this.myRef=ref}}
                    />
                    
                </View>
            );
        
    }
}

export default Finding