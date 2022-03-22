
import 'firebase/storage'
import firebase from "./Initial";


class Storage{
  constructor(){
    
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
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
        success(downloadURL)
      })
    })
  }


}
const storage = new Storage()
export default storage