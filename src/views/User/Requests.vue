<template>
    <v-container>
        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
                <v-layout row wrap class="text-xs-right mb-3" align-center>
                    <v-flex xs12>
                        <v-layout>
                            <v-flex xs12>
                        <v-textarea
                            label="Hva trenger du hjelp med?"
                            v-model="request"
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
                                    label="Pris"
                                    v-model="price"
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
                                    @click="onSaveChanges"
                                    class="success">
                                    Legg til Bestilling
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
                <v-layout row wrap class="text-xs-left" align-center>
                    <v-flex xs12>
                        <v-card flat v-if="requests" v-for="(req, i) in requests" :key="`${i}-${req.id}`" style="border: 1px solid #ccc" class="mb-2">
                            <v-layout row>
                             <v-flex xs4 sm3 class="text-xs-center" @click="toMem(req.creator_id)" style="cursor: pointer">
                                <v-avatar v-if="getUser(req.creator_id).imageURL" style="width: 100%; height: auto; margin: 20px;" size="70px">
                                    <img 
                                    :src="getUser(req.creator_id).imageURL"
                                    >
                                </v-avatar>
                                <v-avatar v-if="!getUser(req.creator_id).imageURL" style="width: 100%; height: auto; margin: 20px;" size="70px">
                                    <img :src="require('../../assets/profile.svg')">
                                </v-avatar>
                             </v-flex>

                             <v-flex xs7 sm8>
                                <v-card-title primary @click="toMem(req.creator_id)" style="cursor: pointer" >
                                    <h3>{{ getUser(req.creator_id).name }}</h3>
                                </v-card-title>

                                <v-card-text class="py-0">
                                    <div>{{ req.request }}</div>
                                    <div>pris: {{ req.price }}</div>
                                    <div>Sted: {{ req.place }}</div>
                                </v-card-text>

                                <v-card-actions> <!-- v-if="getUser(req.creator_id).id !== user.id">-->
                                    <v-btn flat
                                        :to="'/chat/' + getUser(req.creator_id).id"
                                                      block
                                                      outline
                                                      class="primary primary--text"
                                        >
                                        <!-- <v-icon left light>arrow_forward</v-icon> -->
                                        Send melding
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
</template>

<script>
 export default {
   data() {
    return {
        request: '',
        price: '',
        place: ''
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
        return this.$store.getters.req
     }
   },
   methods: {
        onSaveChanges(){
            this.$store.dispatch('addReq', {
                creator_id: this.user.id,
                request: this.request,
                price: this.price,
                place: this.place,
            })
        },
       toMem(id){
        this.$router.push('/profile/' + id)
       }
   }
 }
</script>
