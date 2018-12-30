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
                            box
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
                                    box
                                    hide-details
                                    required>
                                </v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs6>
                                <v-text-field
                                    label="Sted/Tid"
                                    v-model="place"
                                    box
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
                        <v-card flat style="border: 1px solid #ccc">
                            Bestillinger
                        </v-card>
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
        }
   }
 }
</script>
