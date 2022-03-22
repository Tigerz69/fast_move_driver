import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView
} from 'react-native';

import auth from '../Firebase/Auth'
import firestore from '../Firebase/Firestore'
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker'; 

const options = [
  { value: 'ธนาคารแห่งประเทศไทย', label: 'ธนาคารแห่งประเทศไทย' },
  { value: 'ธนาคารกรุงเทพ', label: 'ธนาคารกรุงเทพ' },
  { value: 'ธนาคารกสิกรไทย', label: 'ธนาคารกสิกรไทย' },
  { value: 'ธนาคารกรุงไทย', label: 'ธนาคารกรุงไทย' },
  { value: 'ธนาคารทหารไทยธนชาต', label: 'ธนาคารทหารไทยธนชาต' },
  { value: 'ธนาคารไทยพาณิชย์', label: 'ธนาคารไทยพาณิชย์' },
  { value: 'ธนาคารกรุงศรีอยุธยา', label: 'ธนาคารกรุงศรีอยุธยา' },
  { value: 'ธนาคารเกียรตินาคินภัทร', label: 'ธนาคารเกียรตินาคินภัทร' },
  { value: 'ธนาคารออมสิน', label: 'ธนาคารออมสิน' },
  { value: 'ธนาคารอิสลามแห่งประเทศไทย', label: 'ธนาคารอิสลามแห่งประเทศไทย' },
];



class Registraion extends Component {
  constructor(props){
    super(props);
     this.state = {
       email:null,
       password:null,
       confirmpassword:null,
       username:null,
       firstname:null,
       lastname:null,
       phone:null,
       isFocus:false,
       value:null,
       bankno:null,
       carid:null,
       image:null
    };
  }
  
  componentDidMount() {
 
  }

  registerUnsuccess=(error)=>{
    console.log(error)
  }

  registerSuccess=(user)=>{
    let item ={
      username:this.state.username,
      firstname:this.state.firstname,
      lastname:this.state.lastname,
      phone:this.state.phone,
      email:this.state.email,
      time:null,
      role:'driver',
      image:'',
      status:1,
      carid:this.state.carid

    }
    console.log(item)
    firestore.addUser(user.uid,item,this.addSuccess,this.addUncsuccess)
  }

  addSuccess=()=>{
    this.props.navigation.navigate('Login')
  }

  addUncsuccess=(error)=>{
    console.log(error)
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption));
    
  }
  

  onRegister=()=>{
    if(this.state.password!=null){
       if(this.state.password===this.state.confirmpassword){
        auth.createAccount(this.state.email,this.state.password,this.registerSuccess,this.registerUnsuccess)
       }
    }
  }

  pickImage=async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowsEditing:true,
      quality:1
    });

    if(!result.cancelled){
      this.setState({image:result.uri});
    }
  }



  render(props) {
    const { navigation } = this.props;
    
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>

        <ScrollView ContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.content}>
              <TouchableOpacity onPress={this.pickImage}>
                <Image source={{ uri:this.state.image }} style={styles.image} />
              </TouchableOpacity>
              <TextInput 
                placeholder="User Name" 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({username:txt})}}/>

              <TextInput 
                placeholder="Fisrt Name" 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({firstname:txt})}}/>
              <TextInput 
                placeholder="Last Name" 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({lastname:txt})}}/>

              <Dropdown
                  style={[styles.dropdown, this.state.isFocus && { borderColor: 'blue' }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={options}
                  //search
                  dropdownPosition='down'
                  maxHeight={120}

                  labelField="label"
                  valueField="value"
                  placeholder={!this.state.isFocus ? 'ธนาคาร' : '...'}
                  searchPlaceholder="Search..."
                  value={this.state.value}
                  onFocus={() => this.setState({isFocus:true})}
                  onBlur={() =>this.setState({isFocus:false})}
                  onChange={item => {
                    this.setState({value:item.value});
                    this.setState({isFocus:false});
                    this.handleChange(item.value)
                    //console.log(this.state.value)
                  }}
                   
                />
              <TextInput 
                placeholder="Bank Account No." 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({bankno:txt})}}/>

              <TextInput 
                placeholder="Phone " 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({phone:txt})}}/>

              <TextInput 
                placeholder="Car ID " 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({carid:txt})}}/>

              <TextInput 
                placeholder="Email" 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({email:txt})}}/>
              <TextInput 
                placeholder="Password"
                secureTextEntry={true}
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({password:txt})}}/>
              <TextInput 
                placeholder="Confirm Password"
                secureTextEntry={true} 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({confirmpassword:txt})}}/>
            
              <TouchableOpacity 
                style={styles.buttonLogin} 
                onPress={this.onRegister}>
                  <Text style={{fontSize:16, color:'white'}}>Register</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  buttonLogin: {
   justifyContent:"center",
    alignItems: "center",
    backgroundColor: "pink",
    marginBottom:8,
    padding:8
  },
  textInput:{
    borderColor: 'pink',
    borderWidth: 1,
    paddingStart:20,
    marginBottom:8,
    padding:8,
    fontSize:16,
    color:'pink'
  },
  dropdown:{
    borderColor: 'pink',
    borderWidth: 1,
    paddingStart:20,
    marginBottom:8,
    padding:8,
    fontSize:16,
    color:'pink'
  },
  date:{
    borderWidth:1,
    borderColor: 'pink',
    padding:8,
    paddingStart:20,
     marginBottom:8,
    flexDirection:'row', 
    alignItems:'stretch', 
  },
  text:{
  
    padding:8,
    fontSize:16,
    
  },
  content:{
    padding:16,
    margin:16,
    width:"90%"
  },
  container: {
    flex: 1
  },
  image: {
    borderColor: '#6b4683',
    borderWidth: 1,
    width: 100,
    height: 100,
    marginBottom:8,
    borderRadius:50

  },
  
});


export default Registraion;