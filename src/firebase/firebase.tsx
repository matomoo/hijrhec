import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyC3j5KELQx7WEhZILyOiCq0yDhUQeijvu0",
    authDomain: "hijrhec.firebaseapp.com",
    databaseURL: "https://hijrhec.firebaseio.com",
    projectId: "hijrhec",
    storageBucket: "hijrhec.appspot.com",
    messagingSenderId: "669251955422"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const authEmailProvider = firebase.auth.EmailAuthProvider;

export {
  db,
  auth,
  storage,
  authEmailProvider,
};
