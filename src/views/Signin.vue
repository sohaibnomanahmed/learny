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
            <v-flex xs12 sm8 md6 offset-sm2 offset-md3>
                <app-alert @dismissed="onDismissed" :text="error.message" > 
                </app-alert> 
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm8 md6 offset-sm2 offset-md3>
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
                            <p style="color: #455A64; font-size: 110%"><strong>Ønsker du hjelp med å lære noe nytt?</strong> På learny kan du få hjelp med alt fra eksamener, obliger og ukes oppgaver til idrett, spill eller bare lære noe nytt. Legg inn en bestilling og få hjelp med det du trenger !</p>
                            <p style="color: #455A64; font-size: 110%"><strong>Ønsker du en fleksibel jobb?</strong> Hos learny kan du en bli en mentor og lære bort det du kan, fra fag til egne ferdigheter som ditt eget morsmål. Du kan også lære bort noe du kan, til gjengeld få lært noe du alltid har hatt lyst til å lære, ikke vent start nå !</p>
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
                            Logg inn med facebook
                           <span slot="loader" class="custom-loader">
                               <v-icon light>cached</v-icon>
                           </span>
                    </v-btn>
                        <p class="pa-3" style="color: #455A64; font-size: 80%">Vi bruker facebook logg inn, for å forhindre falske brukere, ved å autentisere via facebook aksepterer du vår personvern som er linket på toppen</p>
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
        },
        track(){
            this.$ga.page('/')
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

