import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        loading: false,
        error: null,
        req: [],
        users: [],
        messages: {},
        notf: 0
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload
        },
        setUsers (state, payload){
            state.users = payload
        },
        addReq (state, payload){
            state.req.push(payload)
        },
        setReq (state, payload){
            state.req = payload
        },
        removeSub (state, payload){
            state.user.subList.splice(payload, 1)
        },
        setMessages(state, payload){
            state.messages = payload
        },
        setNotf(state, payload){
            state.notf = payload
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

            // firebase.auth().signInWithRedirect(provider)

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
                            imageURL: "",
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
        fetchUserData({ commit }, payload){
            commit('setLoading', true)

            // get user data and log user inn
            firebase.database().ref('/users/' + payload.uid).on('value',
                data => {
                    const user = data.val()
                    commit('setUser', user)
                },
                error => {
                    console.log(error)
                    commit('setLoading', false)
                })

            // load in users
            firebase.database().ref('/users/').on('value',
                data => {
                    const users = []
                    const obj = data.val()
                    for (let key in obj) {
                        users.push({
                            id: key,
                            name: obj[key].name,
                            bio: obj[key].bio,
                            imageURL: obj[key].imageURL,
                            study: obj[key].study,
                            subList: obj[key].subList,
                        })
                    }
                    commit('setUsers', users)
                    commit('setLoading', false)
                },
                error => {
                    console.log(error)
                    commit('setLoading', false)
                })

            // load in messages
            firebase.database().ref('/messages/').child(payload.uid).on('value',
                data => {
                    const messages = data.val()
                    commit('setMessages', messages)
                    let notf = 0

                    for (let key in messages){
                        let l_notf = notf
                        let unseen = false
                        for (let mkey in messages[key]){
                            let message = messages[key][mkey]
                            if (message.seen === false && message.id !== payload.uid){
                                unseen = true
                            }
                        }
                        if (unseen){
                            notf += 1
                        }
                    }
                    commit('setNotf', notf)
                    commit('setLoading', false)
                },
                error => {
                    console.log(error)
                    commit('setLoading', false)
                })

            // load in requests
            firebase.database().ref('/requests/').on('value',
                data => {
                    const req = []
                    const obj = data.val()
                    for (let key in obj) {
                        req.push({
                            id: key,
                            creator_id: obj[key].creator_id,
                            place: obj[key].place,
                            price: obj[key].price,
                            request: obj[key].request,
                        })
                    }
                    commit('setReq', req)
                    commit('setLoading', false)
                },
                error => {
                    console.log(error)
                    commit('setLoading', false)
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
                                firebase.database().ref('/users/').child(key).update({imageURL: url}).then(data => {
                                    commit('updateUser', {
                                        imageURL: url,
                                        id: key
                                    })
                                    commit('setLoading', false)
                                })
                            })
                    })
                .catch((error) => {console.log(error)})        
        },
        updateUser({commit}, payload){
            commit('setLoading', true)
            const user = {}
            
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
            if (payload.subList){
                user.subList = payload.subList
            }
            firebase.database().ref('/users/').child(payload.id).update(user)
                .then(() => {
                    commit('updateUser', payload)
                    commit('setLoading', false)
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        removeSub({commit, getters}, payload){
            commit('setLoading', true)
            let id = getters.user.id
            firebase.database().ref('/users/').child(id).child('subList').child(payload).remove()
                .then(data => {
                    commit('removeSub', payload)
                    commit('setLoading', false)
                })
                .catch(error => { 
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        addReq({commit}, payload){
            const req = payload
            commit('setLoading', true)
            firebase.database().ref('/requests/').push(req)
                .then(data => {
                    // let key = data.key
                    commit('setLoading', false)
                    // commit('addReq', {
                    //     ...req,
                    //     id: key
                    // })
                })
                .catch(error => {
                    commit('setLoading', false)
                    console.log(error)
                })
        },
        delReq({commit},payload){
            firebase.database().ref('/requests/').child(payload).remove()
                .then(data => {
                    // commit('removeSub', payload)
                    // commit('setLoading', false)
                })
                .catch(error => { 
                    console.log(error)
                    // commit('setLoading', false)
                })

        },
        getMessages({commit}, payload){
            commit('setLoading', true)
            firebase.database().ref('/messages/').child(payload.id).on('value')
                .then(data => {
                    console.log(data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        sendMessage({commit}, payload){
            let myID = payload.id
            let toID = payload.to_id
            const message = {
                id: myID,
                message: payload.message,
                seen: false
            }

            if (myID === toID){
                firebase.database().ref('/messages/').child(myID).child(toID).push(message)
                    .then(data => {
                    })
                    .catch(error => {console.log(error)})
            } else {
                firebase.database().ref('/messages/').child(myID).child(toID).push(message)
                    .then(data => {
                        firebase.database().ref('/messages/').child(toID).child(myID).push(message)
                            .then()
                            .catch(error => {console.log(error)})
                    })
                    .catch(error => {console.log(error)})
            }
        },
        seenMessage({commit, getters}, payload){
            let myID = getters.user.id
            let toID = payload.id
            const seenMessages = payload.mess
            for (let key in seenMessages){
                seenMessages[key] = {
                    id: seenMessages[key].id,
                    message: seenMessages[key].message,
                    seen: true
                }
            }
            firebase.database().ref('/messages/').child(myID).child(toID).set(seenMessages)
                .then(data => { })
                .catch(error => {console.log(error)})
        },
        logout({ commit }) {
            commit('setUser', null)
            commit('setMessages', {})
            commit('setReq', [])
            commit('setUsers', [])
            firebase.auth().signOut()
        },
        clearError({ commit }){
            commit('clearError')
        }
    },
    getters: {
        // loadedMeetups (state) {
        //     return state.loadedMeetups.sort((meetupA, meetupB) => {
        //         return meetupA.date > meetupB.date
        //     })
        // },
        // featuredMeetups (state, getters) {
        //     return getters.loadedMeetups.slice(0, 5)
        // },
        getUser (state) {
            return (userId) => {
                return state.users.find((user) => {
                    return user.id === userId
                })
            }
        },
        messages(state) {
            return state.messages
        },
        req(state) {
            return state.req.reverse()
        },
        user(state) {
            return state.user
        },
        notf(state) {
            return state.notf
        },
        users(state) {
            return state.users
        },
        loading(state){
            return state.loading
        },
        error(state){
            return state.error
        }
    }
})
