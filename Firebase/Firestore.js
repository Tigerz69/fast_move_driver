import firebase from "./Initial";
import 'firebase/firestore';

class Firestore{
 constructor() {
   this.db = firebase.firestore();
  }
  
  addUser=(id,item,success,unsuccess)=>{
    item.time = firebase.firestore.FieldValue.serverTimestamp();
    console.log(item)
    
    this.db
      .collection('users')
      .doc(id)
      .set(item)
      .then(success())
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
      image:data.image
    })
    .then(()=>{
      success();
    })
    .catch((error)=>{
      unsuccess(error)
    });
  }

}

const firestore = new Firestore()
export default firestore
