import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyAgBm1GPv8wojOohra5KqSgKh8eV1X535U",
  authDomain: "timemarks-timevictor.firebaseapp.com",
  databaseURL: "https://timemarks-timevictor.firebaseio.com",
  projectId: "timemarks-timevictor",
  storageBucket: "timemarks-timevictor.appspot.com",
  messagingSenderId: "459851827238",
  appId: "1:459851827238:web:9ff19bfbe964210ad6fee7",
  measurementId: "G-82DKZTP7VD"
};

const fire = firebase.initializeApp(firebaseConfig);
export var firestore = fire.firestore;
export var db = fire.firestore();
export default fire;