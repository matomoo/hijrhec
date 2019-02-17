import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyC3j5KELQx7WEhZILyOiCq0yDhUQeijvu0',
    authDomain: 'hijrhec.firebaseapp.com',
    databaseURL: 'https://hijrhec.firebaseio.com',
    projectId: 'hijrhec',
    storageBucket: 'hijrhec.appspot.com',
    messagingSenderId: '669251955422',
};

// production
// apiKey: "AIzaSyBtDon4Sm8L0mnUiI0LpQ0RfNmJYL_J7a8",
//     authDomain: "hijrhec2019.firebaseapp.com",
//     databaseURL: "https://hijrhec2019.firebaseio.com",
//     projectId: "hijrhec2019",
//     storageBucket: "",
//     messagingSenderId: "910175419058"

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
