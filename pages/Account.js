import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import auth from '../Firebase/Auth'

class Account extends Component {
  constructor(props){
    super(props);
      this.state = {
       username:null, 
       firstname:null,
       lastname:null,
       phone:null,
       email:null,
       time:null
       
    };

  }

  signoutSuccess=()=>{
    this.props.navigation.navigate('Login')
  }

  signoutUnsuccess=(error)=>{
    console.log(error)
  }

  signoutPress=()=>{
    auth.signOut(this.signoutSuccess,this.signoutUnsuccess)
  }
  

  render(props) {
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.content}>
              <TouchableOpacity >
                <Image source={{ uri:this.props.user.image }} style={styles.image} />
              </TouchableOpacity>
              <TextInput 
                placeholder="User Name" 
                style={styles.textInput} 
                value = {this.props.user.username}
                onChangeText={txt=>{this.setState({username:txt})}}/>

              <TextInput 
                placeholder="Fisrt Name" 
                style={styles.textInput} 
                value={this.props.user.firstname}
                onChangeText={txt=>{this.setState({username:txt})}}/>
              <TextInput 
                placeholder="Last Name" 
                style={styles.textInput} 
                value={this.props.user.lastname}
                onChangeText={txt=>{this.setState({username:txt})}}/>

              <TextInput 
                placeholder="Phone " 
                style={styles.textInput}
                value={this.props.user.phone} 
                onChangeText={txt=>{this.setState({email:txt})}}/>

              <TextInput 
                placeholder="Email" 
                style={styles.textInput} 
                value={this.props.user.email} 
                onChangeText={txt=>{this.setState({email:txt})}}/>

              <TouchableOpacity 
                style={styles.buttonLogin} 
                onPress={this.signoutPress}>
                  <Text style={{fontSize:16, color:'white'}}>Log out</Text>
              </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  buttonLogin: {
    justifyContent:"center",
    alignItems: "center",
    backgroundColor: "#1D3557",
    height:50,
    width:200,
    borderRadius:15,
    alignSelf:'center'
  },
  textInput:{
    borderColor: 'black',
    borderWidth: 1,
    paddingStart:20,
    marginBottom:8,
    padding:8,
    fontSize:16,
    color:'#1D3557',
    borderRadius:15
  },
  content:{
    padding:16,
    margin:16,
    width:"90%",
    backgroundColor:'#F1FAEE'
  },
  container: {
    flex: 1,
    backgroundColor:'#F1FAEE'
  },
  image: {
    borderColor: '#1D3557',
    borderWidth: 1,
    width: 100,
    height: 100,
    marginBottom:8,
    borderRadius:50

  },
  
});

const mapStateToProps = (state) => (
  {user:state.userReducer.user}
)

export default connect(mapStateToProps)(Account);
