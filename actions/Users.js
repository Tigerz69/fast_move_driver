import {ADD_USER,START_CHAT} from './Types'
  
  
  export const addUser=(item)=>(
    {
      type:ADD_USER,
      id:item.id,
      username:item.username,
      firstname:item.firstname,
      lastname:item.lastname,
      phone:item.phone,
      email:item.email,
      time:item.time,
      image:item.image
    }
  )
  export const startChat = (id) => (
    {
      type:START_CHAT,
      id:id
      
    }
  )


  
  
  
  
  
  