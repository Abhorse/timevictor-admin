const { default: firebase } = require("../config/firebase");

class Authentication {
    login(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    logout() {
        return firebase.auth().signOut();
    }
}

export default Authentication;