import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  FlatList,
  RefreshControl
} from 'react-native';
import { Card,Avatar,Title,Paragraph } from 'react-native-paper';

import auth from "../Firebase/Auth"
import 'firebase/firestore';
import firebase from "../Firebase/Initial";
class CurrentJob extends Component {
  constructor(props){
    super(props);
    this.db = firebase.firestore();
     this.state = {
       orders:null,
       refreshing:false
    };
  }
  onRefresh =  () => {
    this.setState({refreshing:true})
    let user = auth.getCurrentUser() 
    let driverid = user.uid
    firebase.firestore().collection("orders").where("status","==","matched").where("driverID", "==",driverid).get().then((querySnapshot) => {
        
        let orders = [];
        console.log('before foreach')
        querySnapshot.forEach((doc) => {
            console.log('id doc',doc.id)
            orders.push(doc.data())
            //console.log(doc.data()) 
            this.setState({orders:orders})
            
        })  
           
        
        // Promise.all(this.state.promises).then(function(data){
        //   that.setState({orders:orders})
        //   console.log("orders list",that.state.orders)
        // })   
        
    })  
          
       
       // Promise.all(this.state.promises).then(function(data){
       //   that.setState({orders:orders})
       //   console.log("orders list",that.state.orders)
       // })   
    
     this.setState({refreshing:false},()=>
     console.log('orders in list state',this.state.orders))
     
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
  
  componentDidMount() {
    let user = auth.getCurrentUser() 
    let driverid = user.uid
    firebase.firestore().collection("orders").where("status","==","matched").where("driverID", "==",driverid).get().then((querySnapshot) => {
        
        let orders = [];
        console.log('before foreach')
        querySnapshot.forEach((doc) => {
            console.log('id doc',doc.id)
            orders.push(doc.data())
            //console.log(doc.data()) 
            this.setState({orders:orders})
            
        })  
           
        
        // Promise.all(this.state.promises).then(function(data){
        //   that.setState({orders:orders})
        //   console.log("orders list",that.state.orders)
        // })   
        
    })
  }

  

  render(props) {
    const { navigation } = this.props;
    //let arr=[]
    // for(let i=0;i<num;i++)
    //     {
    //         arr.push(
    //             <Paragraph>{`จุดที่ ${i+1} `+item.wayPointList[i].address}</Paragraph>,
    //             <Paragraph>{`รายละเอียดงาน : `+item.wayPointList[i].details}</Paragraph>,
    //             //<Paragraph>{`เบอร์ติดต่อ : `+item.wayPointList[i].phonenumber}</Paragraph>
    //         )
    //     }
    //console.log(route.params.item,route.params.num)
    return (
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
                                  
                                  <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('FullDetail',{item:item,num:num,time:this.renderTime(item.getTime)})}   ><Text>รายละเอียด</Text>
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
    );
  }
}

const styles = StyleSheet.create({
  
});


export default CurrentJob;