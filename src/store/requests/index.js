import * as firebase from 'firebase'

export default {
    state: {
        req: [],
    },
    mutations: {
        addReq (state, payload){
            state.req.push(payload)
        },
        setReq (state, payload){
            state.req = payload
        }
    },
    actions: {
        fetchUserRequests({ commit }, payload){
            commit('setLoading', true)

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

        }
    },
    getters: {
        req(state) {
            return state.req.reverse()
        }
    }
}
