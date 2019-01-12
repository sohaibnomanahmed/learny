import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import firebase from 'firebase'
import AlertCmp from './components/Alert.vue'
import ChatView from './views/User/Chat/ChatView'

Vue.config.productionTip = false
Vue.component('app-alert', AlertCmp)
Vue.component('chat-view', ChatView)

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
                this.$store.dispatch('fetchUserRequests', user)
                this.$store.dispatch('fetchUserMessages', user)
                this.$store.dispatch('fetchUserData', user)
            }
        })
    }
}).$mount('#app')
