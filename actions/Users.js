import {ADD_USER,} from './Types'
  
  
  export const addUser=(item)=>(
    {
      type:ADD_USER,
      id:item.id,
      username:item.username,
      firstname:item.firstname,
      lastname:item.lastname,
      phone:item.phone,
      email:item.email,
      time:item.time
    }
  )
  
  
  
  
  