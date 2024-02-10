import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
const firebaseConfig = {
  // Your Firebase config object here
  apiKey: "AIzaSyDXlkGRDD2LoBV_-jHCiC-ObJ9wqktq1dY",
  authDomain: "code-editor-b334a.firebaseapp.com",
  projectId: "code-editor-b334a",
  storageBucket: "code-editor-b334a.appspot.com",
  messagingSenderId: "354423710434",
  appId: "1:354423710434:web:bdd205cfeb29e53231f4bb"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBWdqWCnK6utrOEedz7Zd0HNagJRAaN-q0",
//   authDomain: "collaborativecodeeditor-635c0.firebaseapp.com",
//   projectId: "collaborativecodeeditor-635c0",
//   storageBucket: "collaborativecodeeditor-635c0.appspot.com",
//   messagingSenderId: "232878338430",
//   appId: "1:232878338430:web:4f8f42293076f4687b832f",
//   // measurementId: "G-ZFC2LTQTKL"
// };
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
export {database, app}

