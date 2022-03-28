
import {CONFIG} from './Config'
import firebase from 'firebase';
import 'firebase/firestore';

class Firestore{
 constructor()  {

  if(firebase.apps.length===0)
    firebase.initializeApp(CONFIG)
    
   this.db = firebase.firestore()
  }
  
  addUser=(id,item,success,unsuccess)=>{
    item.time = firebase.firestore.FieldValue.serverTimestamp();
    console.log(item)
    
    this.db
      .collection('users')
      .doc(id)
      .set(item)
      .then(success(id))
      .catch(function (error) {
        unsuccess(error);
      });
  }

  getUser=(id,success,unsuccess)=>{
    var docRef = this.db.collection('users').doc(id);
    docRef
    .get()
    .then((doc)=>{
      success(doc.data())
    })
    .catch((error)=>{
      unsuccess(error)
    })

  }

  saveOrder=(item,success,unsuccess)=>{ 
    
    console.log(item)
    
    this.db
      .collection('orders')
      .add(item) 
      .then(success())
      .catch(function (error) {
        unsuccess(error);
      });
  }
  uploadImage=(id,data,success,unsuccess)=>{
    console.log(id)
    var ref = this.db.collection('users').doc(id);
    ref
    .update({
      image:data
    })
    .then(()=>{
      success();
    })
    .catch((error)=>{
      unsuccess(error)
    });
  }
  addMessageRoom=(pass,fail)=>{
    var docRef = this.db.collection('message').add({}).then((doc)=> pass(doc.id)).catch((error)=>fail(error));
    /*
    var docRef = this.db.collection('message').doc();
    docRef.set({});
    console.log('CHAT ID : '+docRef.id);
    pass(docRef.id);
    */
  }
  addChat = (id, data, pass, fail) => {
    console.log(data);
    var docRef = this.db
      .collection('orders')
      .doc(id)
      .update({ chat:data  })
      .then(() => {pass()})
      .catch((error) => {fail(error)});
  };

  sendMessage = (id, sender, message, pass, fail) => {
    var docRef = this.db.collection('message').doc(id).collection('messages');
    var messageData = {
      sender: sender,
      message: message,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    };
    docRef
      .add(messageData)
      .then((doc) => {
        pass(doc.id);
      })
      .catch((error) => {
        fail(error);
      });
  };

  listeningMessage = (id, pass) => {
    var docRef = this.db
      .collection('message')
      .doc(id)
      .collection('messages')
      .orderBy('time', 'asc');
    docRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          pass(change.doc.data());
        }
      });
    });
  };

}

const firestore = new Firestore()
export default firestore
