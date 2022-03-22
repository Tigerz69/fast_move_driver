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
class History extends Component {
  constructor(props){
    super(props);
    this.db = firebase.firestore();
     this.state = {
       
    };
  }
  
  componentDidMount() {
   
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,marginTop: StatusBar.currentHeight || 0}}>
            
            <Text>History</Text>
    
            
          


        </View>
    );
  }
}

const styles = StyleSheet.create({
  
});


export default History;