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
            <v-layout row wrap>
                <v-flex xs12 sm8 offset-sm2 class="text-xs-left">
                    <v-card flat style="border: 1px solid #ccc">
                        <v-container>
                        <v-layout row wrap v-if="chatlist" v-for="(chat, i) in chatlist" :key="i" class="mb-2" >
                            <v-btn flat :to="'/chat/' + chat" block large>
                            <v-flex xs12>
                                <v-avatar size="40px" class="mr-2" v-if="getUser(chat).imageURL">
                                    <img :src="getUser(chat).imageURL">
                                </v-avatar>
                                <v-avatar size="40px" class="mr-2" v-if="!getUser(chat).imageURL">
                                    <img :src="require('../../../assets/profile.svg')">
                                </v-avatar>
                                {{ getUser(chat).name }}
                            </v-flex>
                            </v-btn>
                        </v-layout>
                        <h3 v-else style="color: #ccc">Ingen bestillinger enda</h3>
                        </v-container>
                    </v-card>
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
            chatlist: []
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
            return  this.$store.getters.messages
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
        },
    },
    created() {
        for (let key in this.messages){
            this.chatlist.push(key)
        }
    }
} 
</script>
