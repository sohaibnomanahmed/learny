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
                            <v-text-field
                                label="Søk etter navn, studie elle emne"
                                v-model="search"
                                prepend-icon="search"
                                solo
                                hide-details
                                flat
                                style="border: 1px solid #ccc"
                                class="mb-3 pl-2"
                                >
                            </v-text-field>
                    <v-card flat :to="'/profile/' + getUser(Luser.id).id" style="border: 1px solid #ccc; cursor: pointer" v-for="(Luser, i) in users" :key="`${i}-${Luser.id}`" class="mb-2"  >
                        <v-container>
                            <v-layout row wrap >
                                <v-flex xs3 sm1>
                                <v-avatar size="40px" v-if="getUser(Luser.id).imageURL">
                                    <img :src="getUser(Luser.id).imageURL">
                                </v-avatar>
                                <v-avatar size="40px" v-if="!getUser(Luser.id).imageURL">
                                    <img :src="require('../../assets/profile.svg')">
                                </v-avatar>
                                </v-flex>
                            <v-flex xs9 sm11>
                                <div><h4>{{ getUser(Luser.id).name }}</h4></div>
                                <div>Studie: {{ getUser(Luser.id).study }}</div>
                            </v-flex>
                        </v-layout>
                        </v-container>
                    </v-card>
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
            search: ''
        }
    },
    computed: {
        user(){
            return this.$store.getters.user
        },
        getUser (){
            return this.$store.getters.getUser
        },
        users(){
//            ^    # assert position at start of line
//            (    # Start group 1
//            .+   # match any character (except line terminators), one or more times
//            )    # End group 1
//            \/   # match `/` literally
//            .*   # match any character (except line terminators), zero or more times
//            $    # assert position at end of line
            
            let allUsers = this.$store.getters.users
            let searchedUsers = []
            for (let index in allUsers){
                const regex = new RegExp(this.search, "gi");
                if (regex.test(allUsers[index].study) || regex.test(allUsers[index].name) || this.checkSub(allUsers[index].subList, regex)){
                    searchedUsers.push(allUsers[index])
                }
            }
            return searchedUsers
        },
        error(){
            return this.$store.getters.error
        },
        loading(){
            return this.$store.getters.loading
        }
    },
    methods: {
        checkSub(subList, regex){
            if (subList){
                for (let key in subList){
                    if (regex.test(subList[key].sub)){
                        return true
                    }
                }
            }
            return false
        },
    },
    created() {
        for (let key in this.messages){
            this.chatlist.push(key)
        }
    }
} 
</script>
