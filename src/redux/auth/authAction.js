import firebase from "firebase/compat/app";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { Sdk } from "../../constants/firebaseConstants";
import { LOGIN, LOGOUT } from "./authTypes";
import "firebase/compat/auth";
import axios from "axios";

firebase.initializeApp({
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  apiKey: Sdk.apiKey,
  authDomain: Sdk.authDomain,
  projectId: Sdk.projectId,
  storageBucket: Sdk.storageBucket,
  messagingSenderId: Sdk.messagingSenderId,
  appId: Sdk.appId,
  measurementId: Sdk.measurementId,
});

const firebaseAuth = getAuth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export const loginAction = (payload, navigate,toast) => async (dispatch) => {
  let obj = {
    isLoggedIn: true,
    user: payload,
  };

  localStorage.setItem("cache", JSON.stringify(obj));
  console.log("payload",payload)
   getUsers(payload[0])
  dispatch({
    type: LOGIN,
    payload: payload,
  })

  toast({
    title: 'Login Successfull.',
    description: "",
    status: 'success',
    duration: 2000,
    isClosable: true,
  })
  navigate("/");
};

export const logoutAction = () => {
  localStorage.setItem("cache", null);
  return {
    type: LOGOUT,
  };
};

export function signup(name, email, password,toast,navigate) {
  return async (dispatch, getState) => {
    try {
      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      await user.updateProfile({
        displayName: name,
      });
      // Dispatch a success action
    
      toast({
        title: 'Sign Up Successfull.',
        description: "Login to Continue",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      navigate("/login")
    } catch (error) {
      // Dispatch an error action
      toast({
        title: 'User Already exist',
        description: "",
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  };
}

export function manualSignin(navigate, email, password,toast) {
  return async (dispatch, getState) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = firebase.auth().currentUser;
      const uid=user.uid
      const displayName=user.displayName
      // Dispatch a success action
      let obj = {
        isLoggedIn: true,
        user: [{ email: email, displayName: user.displayName,uid:uid }],
      };
      getUsers({
        uid,
        email,
        displayName
      })
      localStorage.setItem("cache", JSON.stringify(obj));

      if (email.includes("@productify.com")) {
        navigate("/admin")
      
      }else{
        navigate("/");
      }
    
      dispatch({
        type: LOGIN,
        payload: [{ email: email, displayName: user.displayName ,uid:uid}],
      });

      toast({
        title: 'Login Successfull.',
        description: "",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      // Dispatch an error action
      toast({
        title: 'Incorrect Credentials.',
        description: "",
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  };
}

export const getUsers=(user)=>{
 axios.get(`http://localhost:8080/users`)
 .then((res)=>{
  let flag=false
  res.data.map((el)=>{
    if(el.email===user.email){
      flag=true
    }
  })

  if(!flag){
    const UserData={
      id:user.uid,
      name:user.displayName,
      email:user.email,
      cart:[
        
      ],
      order:[

      ]

     
    }
    axios.post(`http://localhost:8080/users`,UserData)
  }
 })
}

// {
//   date:,
//   status:
//   id:1,
//   ...el,
//   quantity:3

// }