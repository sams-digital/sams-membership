import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyCdSx0kZ2QPTfQqgooXMEu7ziHtPr8PTMM",

    authDomain:
        "sams-course-platform-b5b5e.firebaseapp.com",

    projectId:
        "sams-course-platform-b5b5e",

    storageBucket:
        "sams-course-platform-b5b5e.firebasestorage.app",

    messagingSenderId:
        "839145367791",

    appId:
        "1:839145367791:web:03f2ce1d95df601db1931a"

};


const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(app);


const db =
    getFirestore(app);


const googleProvider =
    new GoogleAuthProvider();


googleProvider.setCustomParameters({
    prompt: "select_account"
});


export {
    app,
    auth,
    db,
    googleProvider
};