import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        loading: false,
        error: null
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload
        },
        updateUser({commit}, payload){

            if (payload.imageURL){
                user.imageURL = payload.imageURL
            }
            if (payload.bio){
                user.bio = payload.bio
            }
            if (payload.subList){
                user.subList = payload.subList
            }
            if (payload.study){
                user.study = payload.study
            }
        },
        setLoading (state, payload) {
            state.loading = payload
        },
        setError (state, payload) {
            state.error = payload
        },
        clearError (state, payload) {
            state.error = null
        }
    },
    actions: {
        signUserIn({ commit }) {
            commit('setLoading', true)
            commit('clearError')
            var provider = new firebase.auth.FacebookAuthProvider()
            var name = ''

            firebase.auth().signInWithPopup(provider)
                .then(result => {
                    var token = result.credential.accessToken
                    var user = result.user
                    name = user.displayName
                    return user})
                .then(user => {
                    return firebase.database().ref('/users/' + user.uid).once('value')})
                .then(data => {
                    var key = data.key 
                    var user = data.val()

                    if (user === null){
                        const newUser = {
                            name: name,
                            id: key,
                            bio: '',
                            imageURL: false,
                            requests: [],
                            offers: []
                        }
                        firebase.database().ref('users/' + key).push(newUser)
                            .then(result => {
                                commit('setLoading', false)
                                commit('setUser', newUser)})
                            .catch(error => {
                                commit('setLoading', false)
                                commit('setError', error)
                                console.log(error)})
                    } else {
                        for (let key in user){
                            commit('setLoading', false)
                            commit('setUser', user[key])
                        }
                    }})
                .catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error)
                    }
                )
        },
        fetchUserData({ commit, getters }){
            commit('setLoading', true)
            firebase.database().ref('/users/' + getters.user.id).once('value')
                .then(data => {
                    const user = data.val()
                    for (let key in user){
                        commit('setLoading', false)
                        commit('setUser', user[key])
                    }
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        autoSignIn({ commit }, payload) {
            commit('setUser', {
                name: payload.name,
                id: payload.uid,
                image: payload.image,
                bio: payload.bio,
                requests: [],
                offers: []
            })
        },
        updateImage({commit, getters}, payload){
            let imageURL
            let key = payload.id
            
            const filename = payload.image.name
            const ext = filename.slice(filename.lastIndexOf('.'))
            firebase.storage().ref('users/' + key + '.' + ext).put(payload.image)
                .then(
                    fileData => {
                        firebase.storage().ref(fileData.metadata.fullPath).getDownloadURL()
                          .then((url) => {
                              firebase.database().ref('/users/' + key).once('value')
                                  .then(data => {
                                      var user = data.val()
                                      for (let userKey in user){
                                        return firebase.database().ref('/users/' + key).child(userKey).update({imageURL: url})
                                      }
                          })
                 })})
                .then(
                    () => {    
                        commit('updateUser', {
                            imageURL: imageURL,
                            id: key
                        })
                    }
            ).catch(
                (error) => {
                    console.log(error)
                }
            )        
        },
        logout({ commit }) {
            firebase.auth().signOut()
            commit('setUser', null)
        },
        clearError({ commit }){
            commit('clearError')
        }
    },
    getters: {
        user(state) {
            return state.user
        },
        loading(state){
            return state.loading
        },
        error(state){
            return state.error
        }
    }
})
