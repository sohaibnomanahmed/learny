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
            <chat-view :id="toId" style="height:450px; overflow-y:scroll;" class="chat-view"></chat-view> 
                        <v-textarea
                            label="Skriv en melding"
                            v-model="mess"
                            solo
                            flat
                            hide-details
                            @keyup.enter.native="sendMessage"
                            append-icon="send"
                            @click:append="sendMessage"
                            style="
                                border-left: 1px solid #ccc;
                                border-right: 1px solid #ccc;
                                border-bottom: 1px solid #ccc;
                                "
                            required>
                        </v-textarea>
                    </v-card>
                        <!-- <v-btn -->
                        <!--     flat --> 
                        <!--     @click="sendMessage" -->
                        <!--     class="primary mt-2" -->
                        <!--     style="width:100%; margin:0;"> -->
                        <!--     Send Melding -->
                        <!-- </v-btn> -->
                </v-flex>
                {{ messages }}
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
            toId: ''
        }
    },
    computed: {
        user(){
            return this.$store.getters.user
        },
        getUser (){
            return this.$store.getters.getUser
        },
        error(){
            return this.$store.getters.error
        },
        loading(){
            return this.$store.getters.loading
        },
        messages(){
            let messages =  this.$store.getters.messages
        },
    },
    methods: {
        sendMessage(){
            if (this.mess.trim() == ''){
                return
            }

            let timed = new Date()
            timed.setHours(timed.getHours())
            timed.setMinutes(timed.getMinutes())
            this.$store.dispatch('sendMessage', {
                id: this.user.id,
                to_id: this.$props.id,
                message: this.mess,
                time: timed
            })
            this.mess = ''
        },
        track(){
            this.$ga.page('/chat')
        }
    },
    updated() {
        var container = this.$el.querySelector(".chat-view");
        container.scrollTop = container.scrollHeight;
    },
    mounted() {
        var container = this.$el.querySelector(".chat-view");
        container.scrollTop = container.scrollHeight;
    },
    created() {
        this.mess = ''
        this.toId = this.$props.id
    }
} 
</script>
