<template>
    <div>
    <v-container v-if="loading">
        <v-layout row>
            <v-flex xs12 class="text-xs-center" >
                <v-progress-circular
                         indeterminate
                         color="primary"
                         :width="7"
                         :size="70"
                         v-if="loading"
                         ></v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
    <v-container v-else>
        <v-layout>
            <v-flex xs12 sm8 md6 offset-sm2 offset-md3>
                <v-layout row wrap class="text-xs-right mb-3" align-center>
                    <v-flex xs12>
                            <v-text-field
                                label="Søk etter bestillinger, tilbud, eller sted/tid"
                                v-model="search"
                                prepend-icon="search"
                                solo
                                hide-details
                                flat
                                style="border: 1px solid #ccc"
                                class="mb-3 pl-2"
                                >
                            </v-text-field>
                    </v-flex>
                    <v-flex xs12 v-if="user">
                        <form @submit.prevent="onSaveChanges">
                        <v-layout>
                            <v-flex xs12>
                        <v-textarea
                            label="Hva trenger du hjelp med?"
                            v-model="request"
                            :disabled="!user"
                            solo
                            flat
                            style="border: 1px solid #ccc"
                            hide-details
                            required>
                        </v-textarea>
                            </v-flex>
                        </v-layout>

                        <v-layout>
                            <v-flex xs6>
                                <v-text-field
                                    label="Tilbyr"
                                    v-model="price"
                                    :disabled="!user"
                            solo
                            flat
                            style="border-right: 1px solid #ccc;
                                    border-bottom: 1px solid #ccc;
                                    border-left: 1px solid #ccc"
                                    hide-details
                                    required>
                                </v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs6>
                                <v-text-field
                                    label="Sted/Tid"
                                    :disabled="!user"
                                    v-model="place"
                            solo
                            flat
                            style="border-right: 1px solid #ccc;
                                    border-bottom: 1px solid #ccc"
                                    hide-details
                                    required>
                                </v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout>
                            <v-flex xs12>
                                <v-btn flat style="width: 100%; margin: 10px 0px" 
                                    type="submit"
                                    :disabled="!user"
                                    class="success">
                                    Legg til Bestilling
                                </v-btn>
                            </v-flex>
                        </v-layout>

                        </form>
                    </v-flex>
                            <v-flex xs12 v-if="!user">
                                <v-btn flat style="width: 100%; margin: 10px 0px" 
                                    type="submit"
                                    :disabled="!user"
                                    class="success">
                                    LOGG INN FOR Å OPPRETTE EN BESTILLING
                                </v-btn>
                            </v-flex>
                </v-layout>
                <v-layout row wrap class="text-xs-left" align-center>
                    <v-flex xs12>
                        <v-card flat v-if="requests" v-for="(req, i) in requests" :key="`${i}-${req.id}`" style="border: 1px solid #ccc" class="mb-2">
                            <v-layout row>
                             <v-flex xs4 sm3 class="text-xs-center" @click="toMem(req.creator_id)" style="cursor: pointer">
                                    <img style="
                                      object-fit: cover;
                                      border-radius:50%;
                                      width: 80px;
                                      margin: 20px;
                                      height: 80px;" 
                                      :src="getUser(req.creator_id).imageURL">
                             </v-flex>

                             <v-flex xs7 sm8>
                                <v-card-title primary @click="toMem(req.creator_id)" style="cursor: pointer" >
                                    <h3>{{ getUser(req.creator_id).name }}</h3>
                                </v-card-title>

                                <v-card-text class="py-0">
                                    <div style="overflow-wrap: break-word">Trenger hjelp med: {{ req.request }}</div>
                                    <div style="overflow-wrap: break-word">Tilbyr: {{ req.price }}</div>
                                    <div style="overflow-wrap: break-word">Sted/Tid: {{ req.place }}</div>
                                </v-card-text>

                                <v-card-actions v-if="user"> <!-- v-if="getUser(req.creator_id).id !== user.id">-->
                                    <v-btn flat
                                        :to="'/chat/' + getUser(req.creator_id).id"
                                                      block
                                                      v-if="!usersProfile(req.creator_id)"
                                                      outline
                                                      class="primary primary--text"
                                        >
                                        <!-- <v-icon left light>arrow_forward</v-icon> -->
                                        Send melding
                                    </v-btn>
                                    <v-btn flat
                                                      v-else
                                                      block
                                                      outline
                                                      class="red red--text"
                                                      @click="delReq(req.id)"
                                        >
                                        <!-- <v-icon left light>arrow_forward</v-icon> -->
                                        Slett
                                    </v-btn>
                                </v-card-actions>
                                <v-card-actions v-else> <!-- v-if="getUser(req.creator_id).id !== user.id">-->
                                    <v-btn flat
                                                      block
                                                      :disabled="true"
                                                      outline
                                                      class="primary primary--text"
                                        >
                                        Krever Innlogging
                                    </v-btn>
                                </v-card-actions>
                             </v-flex>
                         </v-layout>
                        </v-card>
                        <h3 v-else style="color: #ccc">Ingen bestillinger enda</h3>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
    </div>
</template>

<script>
 export default {
   data() {
    return {
        request: '',
        price: '',
        place: '',
        search: ''
    }  
   },
   computed: {
     user(){
       return this.$store.getters.user
     },
     loading (){
       return this.$store.getters.loading
     },
     getUser (){
       return this.$store.getters.getUser
     },
     requests (){
        let allReq = this.$store.getters.req
        let searchedReq = []
        for (let index in allReq){
            const regex = new RegExp(this.search, "gi")
            if (
                regex.test(allReq[index].request) ||
                regex.test(allReq[index].price) ||
                regex.test(allReq[index].place)
            ){
                searchedReq.push(allReq[index])
            }
        }

         return searchedReq
     }
   },
   methods: {
        onSaveChanges(){
            if (this.request === '' || this.price === '' || this.place === ''){
                return 
            }
            this.$store.dispatch('addReq', {
                creator_id: this.user.id,
                request: this.request,
                price: this.price,
                place: this.place,
            })
            this.request = ''
            this.price = ''
            this.place = ''
        },
       usersProfile(id){
           return this.$store.getters.user.id === id
       },
       delReq(id){
            this.$store.dispatch('delReq', id)
       },
       toMem(id){
           this.$router.push('/profile/' + id)
       },
        track(){
            this.$ga.page('/request')
        }
   }
 }
</script>
