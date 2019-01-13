import * as firebase from 'firebase'

export default {
    state: {
        rev: [],
    },
    mutations: {
        addRev (state, payload){
            state.rev.push(payload)
        },
        setRev (state, payload){
            state.rev = payload
        }
    },
    actions: {
        fetchUserReviews({ commit }, payload){
            commit('setLoading', true)

            // load in requests
            firebase.database().ref('/reviews/').child(payload.uid).on('value',
                data => {
                    const rev = []
                    const obj = data.val()
                    for (let key in obj) {
                        rev.push({
                            id: key,
                            creator_id: obj[key].creator_id,
                            review: obj[key].review,
                        })
                    }
                    commit('setRev', rev)
                    commit('setLoading', false)
                },
                error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        addRev({commit}, payload){
            const req = {
                creator_id: payload.id,
                review: payload.rev
            }
            commit('setLoading', true)
            firebase.database().ref('/reviews/').child(payload.to).push(req)
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
        delRev({commit},payload){
            firebase.database().ref('/reviews/').child(payload).remove()
                .then(data => {
                    // commit('removeSub', payload)
                    // commit('setLoading', false)
                })
                .catch(error => { 
                    console.log(error)
                    // commit('setLoading', false)
                })

        }
    },
    getters: {
        rev(state) {
            return state.rev.reverse()
        }
    }
}
