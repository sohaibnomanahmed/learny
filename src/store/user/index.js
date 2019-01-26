import * as firebase from 'firebase'

export default {
    state: {
        user: null,
        users: [],
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload
        },
        setUsers (state, payload){
            state.users = payload
        },
        removeSub (state, payload){
            console.log(state.user.subList)
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
        }
    },
    actions: {
        signUserIn({ commit }) {
            commit('setLoading', true)
            commit('clearError')
            var provider = new firebase.auth.FacebookAuthProvider()
            var name = ''
            var imageURL = ''

            // firebase.auth().signInWithRedirect(provider)

            firebase.auth().signInWithPopup(provider)
                .then(result => {
                    var token = result.credential.accessToken
                    var user = result.user
                    name = user.displayName
                    imageURL = user.photoURL + "?height=500"
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
                            imageURL: imageURL,
                            subList: [],
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
        fetchUserAuth({ commit }, payload){
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
        },
        fetchUserData({ commit }, payload){
            commit('setLoading', true)

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
            getters.user.subList.splice(payload, 1)
            // console.log(getters.user.subList)
            firebase.database().ref('/users/').child(id).child('subList').set(getters.user.subList)
                .then(data => {
                    // commit('removeSub', payload)
                    commit('setLoading', false)
                })
                .catch(error => { 
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        delUser({ commit, getters }){
            let userId = getters.user.id

            firebase.database().ref('/users/').child(userId).remove()
                .then(date => {
                    firebase.database().ref('/requests/').once('value')
                        .then(data => {
                            const req = data.val()
                            for (let key in req) {
                                if (req[key].creator_id == userId){
                                    firebase.database().ref('/requests/').child(key).remove()
                                }
                            }
                        })
                    firebase.database().ref('/messages/').child(userId).remove()
                    firebase.database().ref('/reviews/').child(userId).remove()
                    commit('setUser', null)
                    commit('setMessages', {})
                    commit('setReq', [])
                    commit('setUsers', [])
                    firebase.auth().signOut()
                })
                .catch(error => {
                    console.log(error)
                })
        },
        logout({ commit }) {
            commit('setUser', null)
            commit('setMessages', {})
            commit('setReq', [])
            commit('setUsers', [])
            firebase.auth().signOut()
        }
    },
    getters: {
        getUser (state) {
            return (userId) => {
                return state.users.find((user) => {
                    return user.id === userId
                })
            }
        },
        user(state) {
            return state.user
        },
        users(state) {
            return state.users
        }
    }
}
