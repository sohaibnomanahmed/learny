import * as firebase from 'firebase'

export default {
    state: {
        rev: {},
        rev_notf: 0
    },
    mutations: {
        setRev (state, payload){
            state.rev = payload
        }
    },
    actions: {
        fetchUserReviews({ commit }, payload){
            commit('setLoading', true)

            // load in requests
            firebase.database().ref('/reviews/').on('value',
                data => {
                    const obj = data.val()
                    commit('setRev', obj)
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
                    commit('setLoading', false)
                })
                .catch(error => {
                    commit('setLoading', false)
                    console.log(error)
                })
        },
        delRev({commit},payload){
            firebase.database().ref('/reviews/').child(payload.user_id).child(payload.id).remove()
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
            return state.rev
        }
    }
}
