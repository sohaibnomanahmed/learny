import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        loading: false,
        error: null,
        req: []
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload
        },
        setReq (state, payload){
            state.req.push(payload)
        },
        updateUser(state, payload){
            let user = state.user

            if (payload.study){
                user.study = payload.study
            }
            if (payload.bio){
                user.bio = payload.bio
            }
            if (payload.imageURL){
                user.imageURL = payload.imageURL
            }
            if (payload.subList){
                user.subList = payload.subList
            }
            if (payload.requests){
                user.requests = payload.requests
            }
            if (payload.offers){
                user.offers = payload.offers
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
                            id: key,
                            name: name,
                            study: '',
                            bio: '',
                            imageURL: '',
                            subList: false,
                            requests: [],
                            offers: []
                        }
                        firebase.database().ref('/users/').child(key).set(newUser)
                            .then(result => {
                                commit('setLoading', false)
                                commit('setUser', newUser)})
                            .catch(error => {
                                commit('setLoading', false)
                                commit('setError', error)
                                console.log(error)})
                    } else {
                          commit('setLoading', false)
                          commit('setUser', user)
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
                    commit('setLoading', false)
                    commit('setUser', user)
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        autoSignIn({ commit }, payload) {
            commit('setUser', {
                id: payload.uid,
                name: payload.name,
                study: payload.study,
                bio: payload.bio,
                imageURL: payload.imageURL,
                subList: payload.subList,
                requests: payload.requests,
                offers: payload.offers
            })
        },
        updateImage({commit, getters}, payload){
            let key = payload.id

            commit('setLoading', true)
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
                                            firebase.database().ref('/users/' + key).child(userKey).update({imageURL: url}).then(data => {
                                                commit('updateUser', {
                                                    imageURL: url,
                                                    id: key
                                                })
                                                commit('setLoading', false)
                                            })
                                        }
                                    })
                            })})
                .catch(
                    (error) => {
                        console.log(error)
                    }
                )        
        },
        updateUser({commit}, payload){
            commit('setLoading', true)
            const user = {}
            firebase.database().ref('/users/' + payload.id).once('value').
                then(data => {
                    var user = data.val()
                    for (let key in user){
                        if (payload.study){
                            user.study = payload.study
                        }
                        if (payload.bio){
                            user.bio = payload.bio
                        }
                        if (payload.requests){
                            user.requests = payload.requests
                        }
                        if (payload.offers){
                            user.offers = payload.offers
                        }
                        user.subList = payload.subList
                        firebase.database().ref('/users/' + payload.id).child(key).update(user)
                            .then(() => {
                                commit('updateUser', payload)
                                commit('setLoading', false)
                            })
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        addReq({commit}, payload){
            const req = payload
            commit('setLoading', true)
            firebase.database().ref('/requests/').push(req)
                .then(data => {
                    let key = data.key
                    commit('setLoading', false)
                    commit('setReq', {
                        ...req,
                        id: key
                    })
                })
                .catch(error => {
                    commit('setLoading', false)
                    console.log(error)
                })
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
        req(state) {
            return state.req
        },
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
