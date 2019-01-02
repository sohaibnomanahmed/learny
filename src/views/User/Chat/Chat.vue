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
                <v-flex xs12 sm8 offset-sm2 class="text-xs-center">
                    <v-card>
                        <v-container>
                            <v-layout v-for="(message, i) in messages" :key="`${i}-${message.id}`" class="mb-2">
                                <v-flex xs12 class="text-xs-right" v-if="message.id === user.id">
                                    <v-layout row wrap>
                                        <v-flex xs10>{{ message.message }}</v-flex>
                                        <v-flex xs2>
                                            <v-avatar size="40px">
                                                <img :src="getUser(message.id).imageURL">
                                            </v-avatar>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="text-xs-left" v-else>
                                    <v-layout row wrap>
                                        <v-flex xs2>
                                            <v-avatar size="40px">
                                                <img :src="getUser(message.id).imageURL">
                                            </v-avatar>
                                        </v-flex>
                                        <v-flex xs10>{{ message.message }}</v-flex>
                                    </v-layout>
                                </v-flex>
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
                        <v-btn
                            flat 
                            @click="sendMessage"
                            class="primary"
                            style="width:100%; margin:0;">
                            Send Melding
                        </v-btn>
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
            return messages[this.$props.id]
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
    },
    created() {
        this.mess = ''
    }
} 
</script>
