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
        <v-layout row v-if="error">
            <v-flex xs12 sm6 offset-sm3>
                <app-alert @dismissed="onDismissed" :text="error.message" > 
                </app-alert> 
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <v-flex xs12 class="text-xs-center">
                    <v-layout row wrap align-center>
                        <v-flex xs12 sm6>
                            <v-img
                             :src="require('../assets/teach.png')"
                             class="my-3"
                             contain
                             height="350"
                             ></v-img>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <p style="color: #455A64; font-size: 120%">Finn mentorer for å hjelp med å lære noe nytt, løse oppgaver, forstå faginnhold og få nyttige tips. Alt fra eksamener, obliger og ukes oppgaver til idrett, spill  og masse annet. Du kan også bli en mentor selv, ikke vent start nå !</p>
                        </v-flex>
                    </v-layout>
                    <v-btn class="primary white--text text-xs-center" 
                           flat
                           large
                           style="
                           width: 90%;
                           margin: 5px 0;"
                           type="info" 
                           @click="onSignin"
                           :disabled="loading" 
                           :loading="loading">
                        Log inn med facebook
                           <span slot="loader" class="custom-loader">
                               <v-icon light>cached</v-icon>
                           </span>
                    </v-btn>
                        <p class="mt-2" style="color: #455A64; font-size: 80%">Vi bruker facebook log inn, fra hvor vi henter navnet til brukeren for å forhindre falske brukere og emailen for å autentisering, slik at vi bare har autentiserte brukere på vår side.</p>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
        }
    },
    computed: {
        user(){
            return this.$store.getters.user
        },
        error(){
            return this.$store.getters.error
        },
        loading(){
            return this.$store.getters.loading
        }
    },
    watch: {
        user(value) {
            if (value !== null && value !== undefined) {
                this.$router.push('/requests')
            } 
        }
    },
    methods: {
        onSignin(){
            this.$store.dispatch('signUserIn')
        },
        onSigninGoogle(){
            this.$store.dispatch('signUserInGoogle')
        },
        onDismissed(){
            this.$store.dispatch('clearError')
        }
    }
} 
</script>


<style>
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}
@-moz-keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
@-webkit-keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
@-o-keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>

