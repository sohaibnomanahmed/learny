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
            <v-layout row>
                <v-flex xs12 sm8 offset-sm2 class="text-xs-center">
                    <v-card flat style="border: 1px solid #ccc">
                        <v-container>
                            <v-layout v-if="messages" row v-for="(message, i) in messages" :key="`${i}-${message.id}`" class="mb-2">
                                <v-flex xs12 class="text-xs-right" v-if="message.id === user.id">
                                    <v-layout row wrap class="text-xs-right" >
                                        <v-flex xs9 sm11>
                                            <p class="primary lighten-4 text-xs-left" style="float: right; border-radius: 10px; padding:10px 16px; color: #455A64; font-size: 120%; overflow-wrap: break-word; max-width: 100%;">{{ message.message }}</p>
                                        </v-flex>
                                        <v-flex xs3 sm1>
                                            <v-avatar size="40px" @click="toChat(message.id)" style="cursor: pointer" v-if="getUser(message.id).imageURL">
                                                <img :src="getUser(message.id).imageURL">
                                            </v-avatar>
                                            <v-avatar size="40px" @click="toChat(message.id)" style="cursor: pointer" v-if="!getUser(message.id).imageURL">
                                                <img :src="require('../../../assets/profile.svg')">
                                            </v-avatar>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="text-xs-left" v-else>
                                    <v-layout row wrap>
                                        <v-flex xs3 sm1>
                                            <v-avatar size="40px" @click="toChat(message.id)" style="cursor: pointer" v-if="getUser(message.id).imageURL">
                                                <img :src="getUser(message.id).imageURL">
                                            </v-avatar>
                                            <v-avatar size="40px" @click="toChat(message.id)" style="cursor: pointer" v-if="!getUser(message.id).imageURL">
                                                <img :src="require('../../../assets/profile.svg')">
                                            </v-avatar>
                                        </v-flex>
                                        <v-flex xs9 sm11>
                                            <p class="green lighten-4 text-xs-left" style="float:left; border-radius: 10px; padding:10px 16px; color: #455A64; font-size: 120%; overflow-wrap: break-word; max-width: 100%">{{ message.message }}</p>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout v-else>
                                <h3 style="color: #ccc">Ingen bestillinger enda</h3>
                            </v-layout>
                        </v-container>
                        <v-divider></v-divider>
                        <v-textarea
                            label="Send en melding?"
                            v-model="mess"
                            solo
                            flat
                            hide-details
                            required>
                        </v-textarea>
                    </v-card>
                        <v-btn
                            flat 
                            @click="sendMessage"
                            class="primary mt-2"
                            style="width:100%; margin:0;">
                            Send Melding
                        </v-btn>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12 sm6 offset-sm3 class="text-xs-center">
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12 sm6 offset-sm3 class="text-xs-center">
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
    props: ['id'],
    data () {
        return {
            mess: '',
        }
    },
    computed: {
        user(){
            return this.$store.getters.user
        },
        getUser (){
            return this.$store.getters.getUser
        },
        messages(){
            let messages =  this.$store.getters.messages
            if (messages){
                return messages[this.$props.id]
            } else {
                return messages
            }
        },
        error(){
            return this.$store.getters.error
        },
        loading(){
            return this.$store.getters.loading
        }
    },
    methods: {
        sendMessage(){
            this.$store.dispatch('sendMessage', {
                id: this.user.id,
                to_id: this.$props.id,
                message: this.mess
            })
            this.mess = ''
        },
        toChat(id){
            this.$router.push('/profile/' + id)
        }
    },
    created() {
        this.mess = ''
    }
} 
</script>
