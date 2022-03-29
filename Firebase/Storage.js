import {CONFIG} from './Config' 
import firebase from 'firebase'
import 'firebase/storage'



class Storage{
  constructor(){
    if(firebase.apps.length===0){
      firebase.initializeApp(CONFIG)
    }
    this.storage = firebase.storage();
  }

  upload=async(uri,fileName,running,success,unsucess)=>{
    const response = await fetch(uri)
    const blob = await response.blob()

    var uploadTask = this.storage.ref().child('image/'+fileName).put(blob)
    uploadTask.on('state_changed'
    ,(snapshot)=>{
      var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      running(progress)
    }
    ,(error)=>{
      unsucess(error)
    }
    ,()=>{
      blob.close();
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
        console.log('downloadURL',downloadURL)
        success(downloadURL)
      }).catch(function(error){
        console.log(error)
      })
    })
  }


}
const storage = new Storage()
export default storage