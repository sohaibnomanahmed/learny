import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/router'
import store from './store'
import firebase from 'firebase'
import AlertCmp from './components/Alert.vue'

Vue.config.productionTip = false
Vue.component('app-alert', AlertCmp)

new Vue({
    router,
    store,
    render: h => h(App),
    created() {
        firebase.initializeApp({
            apiKey: "AIzaSyCbrIgp9WWDW-ue8bQDPpN0BNq2F2JpUPc",
            authDomain: "scope-37c8f.firebaseapp.com",
            databaseURL: "https://scope-37c8f.firebaseio.com",
            projectId: "scope-37c8f",
            storageBucket: "scope-37c8f.appspot.com"
        })
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.$store.dispatch('autoSignIn', user)
                this.$store.dispatch('fetchUserData')
            }
        })
    }
}).$mount('#app')
