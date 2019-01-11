<template>
                    <v-card flat style="border: 1px solid #ccc; max-height: 100%;">
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
                            {{ seenMessage }}
                        </v-container>
                        <span></span>
                    </v-card>
</template>

<script>
export default {
    props: ['id'],
    data () {
        return {
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
        seenMessage(){
            if (this.messages){
                this.$store.dispatch('seenMessage', {
                        mess: this.messages,
                        id: this.$props.id
                })
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
        toChat(id){
            this.$router.push('/profile/' + id)
        }
    },
    updated(){
    },
    created() {
    }
} 
</script>
