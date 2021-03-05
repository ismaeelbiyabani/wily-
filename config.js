 import * as firebase from 'firebase'
 require ('@firebase/firestore')

  var firebaseConfig = {
    apiKey: "AIzaSyD7_IpRIaM99u7BeHFd-tnzKSznJHmtxNY",
    authDomain: "wily-123.firebaseapp.com",
    projectId: "wily-123",
    storageBucket: "wily-123.appspot.com",
    messagingSenderId: "285220503186",
    appId: "1:285220503186:web:909f7085df0bf75546f04b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore;