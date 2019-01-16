import * as firebase from 'firebase'

export default {
    state: {
        messages: [],
        notf: 0
    },
    mutations: {
        setMessages(state, payload){
            state.messages = payload
        },
        setNotf(state, payload){
            state.notf = payload
        }
    },
    actions: {
        fetchUserMessages({ commit }, payload){
            commit('setLoading', true)

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
                seen: false,
                time: payload.time.toISOString()
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
        seenMessage({commit}, payload){
            let myID = payload.userid
            let toID = payload.id
            const seenMessages = payload.mess
            for (let key in seenMessages){
                seenMessages[key] = {
                    id: seenMessages[key].id,
                    time: seenMessages[key].time,
                    message: seenMessages[key].message,
                    seen: true
                }
            }
            
            firebase.database().ref('/messages/').child(myID).child(toID).set(seenMessages)
                .then(data => { })
                .catch(error => {console.log(error)})
        }
    },
    getters: {
        messages(state) {
            return state.messages
        },
        notf(state) {
            return state.notf
        }
    }
}
