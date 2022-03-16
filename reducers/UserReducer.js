import {ADD_USER,} from '../actions/Types'

const intialState = {
 user:{
    id:1,
    username:'test',
    firstname:'test',
    lastname:'test',
    phone:'12234',
    email:'test',
    time:'test'
 }
}



const userReducer=(state = intialState,action)=>{
   switch(action.type){
     case ADD_USER:
      return{
        ...state,user:{
          id:action.id,
          username:action.username,
          firstname:action.firstname,
          lastname:action.lastname,
          phone:action.phone,
          email:action.email,
          time:action.time
        }
      }
    default:
      return state
   }
 }

 export default userReducer