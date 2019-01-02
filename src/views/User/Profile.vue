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
            <!-- <v-layout row wrap> -->
            <!--     <v-flex xs12 sm6 offset-sm3 class="text-xs-center mb-3"> -->
            <!--         <h2 style="color: #455A64">{{ user.name }}</h2> -->
            <!--     </v-flex> -->
            <!-- </v-layout> -->
            <v-layout row wrap>
                <v-flex xs12 sm6 offset-sm3 class="text-xs-center">
                    <div slot="activator">
                        <v-avatar size="150px" v-if="imageURL !== null" class="mb-3">
                            <img :src="imageURL">
                        </v-avatar>
                        <v-avatar size="150px" v-if="imageURL === null" class="mb-3">
                            <img :src="user.imageURL">
                        </v-avatar>
                    </div>
                    <v-btn v-if="usersProfile" @click="onPickFile" class="mb-3">Endre Bildet</v-btn>
                    <v-btn v-if="usersProfile && imageURL !== null" @click="onSaveImage" class="success mb-3">Lagre</v-btn>
                    <input type="file" style="display: None" ref="fileInput" accept="image/*" @change="onFilePicked"></input>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12 sm6 offset-sm3 class="text-xs-center">
                    <v-text-field
                        name="name"
                        label="Navn"
                        id="name"
                        v-model="name"
                        readonly
                        box
                        >
                    </v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12 sm6 offset-sm3 class="text-xs-center">
                    <v-text-field
                        name="study"
                        label="Studie"
                        id="study"
                        v-model="study"
                        :disabled="!usersProfile"
                        box
                        >
                    </v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12 sm6 offset-sm3 class="text-xs-center">
                    <v-textarea
                        name="bio"
                        label="Litt om meg"
                        id="bio"
                        v-model="bio"
                        :disabled="!usersProfile"
                        box
                        >
                    </v-textarea>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12 sm6 offset-sm3 class="text-xs-center">
                    <v-card flat dark>
                        <v-card-title><h4>Fag jeg underviser og ønsket pris i timen</h4></v-card-title>
                        <v-divider></v-divider>
                        <v-list>
                            <v-list-tile v-for="item in subList" :key="item.sub">
                                <v-list-tile-content>{{ item.sub }}</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ item.price }}</v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <v-divider></v-divider>
                            <!-- <v-layout row> -->
                            <!--     <v-flex xs12 class="text-xs-left mt-3 mb-2 ml-3"> -->
                            <!--         <h4>Legg til fag</h4> -->
                            <!--     </v-flex> -->
                            <!-- </v-layout> -->
                        <v-card-actions>
                            <v-layout row align-center>
                                <v-flex xs5 class="mr-2">
                                    <v-text-field
                                        name="sub"
                                        label="Fag"
                                        id="sub"
                                        v-model="sub"
                                        type="sub"
                                        box
                                        required></v-text-field>
                                </v-flex>
                                <v-flex xs5 class="mr-1">
                                    <v-text-field
                                        name="price"
                                        label="Pris"
                                        id="price"
                                        v-model="price"
                                        type="price"
                                        box
                                        required></v-text-field>
                                </v-flex>
                                <v-flex xs1>
                                    <v-icon large color="green darken-2" @click="addSub">add_circle</v-icon>
                                </v-flex>
                            </v-layout>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs12 sm6 offset-sm3 class="text-xs-left mt-3">
                    <v-btn class="success" @click="onSaveChanges">Lagre endringer</v-btn>
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
            imageURL: null,
            image: null,
            subList: null,
            name: '',
            bio: '',
            study: '',
            sub: '',
            price: ''
        }
    },
    computed: {
        user(){
            return this.$store.getters.user
        },
        usersProfile(){
            return this.$store.getters.user.id === this.id
        },
        error(){
            return this.$store.getters.error
        },
        loading(){
            return this.$store.getters.loading
        }
    },
    methods: {
        addSub(){
            if(this.sub === '' || this.price === ''){
                return
            }
            if (this.subList === false){
                this.subList = []
            }
            this.subList.push({
                sub: this.sub,
                price: this.price
            })
            this.sub = ''
            this.price = ''
        },
        onPickFile(){
            this.$refs.fileInput.click()
        },
        onFilePicked(event){
            const files = event.target.files
            let filename = files[0].name
            if (filename.lastIndexOf('.') <= 0) {
                return alert('please add a valid file')
            }
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                this.imageURL = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
            this.image = files[0]

        },
        onSaveImage(){
            if (this.image === null){
                return
            }
            this.$store.dispatch('updateImage', {
                id: this.user.id,
                image: this.image
            })
            this.imageURL = null
        },
        onSaveChanges(){
            this.$store.dispatch('updateUser', {
                id: this.user.id,
                study: this.study,
                bio: this.bio,
                subList: this.subList,
            })
        }
    },
    created() {
        this.name = this.user.name
        this.study = this.user.study
        this.bio = this.user.bio
        this.subList = this.user.subList
    }
} 
</script>
