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
                <v-flex xs12 sm8 md6 offset-sm2 offset-md3>
                    <v-layout row>
                        <v-flex xs12 class="text-xs-center">
                            <div slot="activator">
                                <v-avatar size="150px" v-if="imageURL !== null" class="mb-3">
                                    <img :src="imageURL">
                                </v-avatar>
                                <v-avatar size="150px" v-if="imageURL === null && !getUser(this.$props.id).imageURL" class="mb-3">
                                    <img :src="require('../../assets/profile.svg')">
                                </v-avatar>
                                <v-avatar size="150px" v-if="imageURL === null && getUser(this.$props.id).imageURL" class="mb-3">
                                    <img :src="getUser(this.$props.id).imageURL">
                                </v-avatar>
                            </div>
                            <v-btn v-if="usersProfile" outline flat @click="onPickFile" class="mb-3">Endre Bildet</v-btn>
                            <v-btn v-if="usersProfile && imageURL !== null" flat @click="onSaveImage" class="success mb-3">Lagre</v-btn>
                            <input type="file" style="display: None" ref="fileInput" accept="image/*" @change="onFilePicked"></input>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card flat style="border: 1px solid #ccc" class="mb-2">
                                <v-card-title>
                                    <h4>Om meg</h4>
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-container>
                                    <v-layout row wrap align-center class="mt-2">
                                        <v-flex xs2 sm1>
                                            <v-icon>face</v-icon>
                                        </v-flex>
                                        <v-flex xs10 sm11>
                                            <v-text-field
                                                               v-model="name"
                                                               v-if="usersProfile && edit"
                                                               solo
                                                               flat
                                                               hide-details
                                                               readonly
                                                               style="border: 1px dotted #ccc"
                                                               >
                                            </v-text-field>
                                                <h4 style="color: #455A64" v-else>{{ getUser(this.$props.id).name }}</h4>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap align-center class="mt-2">
                                        <v-flex xs2 sm1>
                                            <v-icon>school</v-icon>
                                        </v-flex>
                                        <v-flex xs10 sm11>
                                            <v-text-field
                                                               label="Studie"
                                                               v-model="study"
                                                               v-if="usersProfile && edit"
                                                               solo
                                                               flat
                                                               hide-details
                                                               style="border: 1px dotted #ccc"
                                                               >
                                            </v-text-field>
                                                <h4 style="color: #455A64" v-else>{{ getUser(this.$props.id).study }}</h4>

                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap align-center class="mt-2">
                                        <v-flex xs2 sm1>
                                            <v-icon>receipt</v-icon>
                                        </v-flex>
                                        <v-flex xs10 sm11>
                                            <v-textarea
                                                               placeholder="Add bio"
                                                               v-model="bio"
                                                               v-if="usersProfile && edit" 
                                                               solo
                                                               flat
                                                               hide-details
                                                               style="border: 1px dotted #ccc"
                                                               >
                                            </v-textarea>
                                                <h4 style="color: #455A64" v-else>{{ getUser(this.$props.id).bio }}</h4>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row v-if="usersProfile" class="mt-2">
                                        <v-flex xs12 v-if="!edit">
                                            <v-btn class="" 
                                                @click="makeEdit" flat block>Endre</v-btn>
                                        </v-flex>
                                        <v-flex xs12 v-else>
                                            <v-btn class="green green--text" 
                                                   outline
                                                :disabled="someSave"
                                                   
                                                @click="onSaveChanges" flat block>Lagre endringer</v-btn>
                                            <v-btn class="red red--text" 
                                                   
                                                   outline
                                                @click="edit = !edit" flat block>Avbryt</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card flat style="border: 1px solid #ccc" v-if="subList || usersProfile">
                                    <v-layout>
                                        <v-container>
                                            <v-layout row align-center>
                                        <v-flex xs4 sm5 ><h4>Emnekode</h4></v-flex>
                                        <v-flex xs4 sm5 class="align-end"><h4>Pris</h4></v-flex>
                                        <v-flex xs2 sm1 class="align-end" v-if="usersProfile">
                                            <v-btn fab small :disabled="true" class="ma-0" dark flat color="white">
                                                <v-icon dark></v-icon>
                                            </v-btn>
                                        </v-flex>
                                        </v-layout>
                                        </v-container>
                                    </v-layout>
                                    <v-divider></v-divider>
                                    <v-layout row wrap v-for="(item, i) in subList" :key="item.sub">
                                        <v-container>
                                            <v-layout row wrap align-center>
                                        <v-flex xs4 sm5 style="overflow-wrap: break-word;" class="mr-2">{{ item.sub }}</v-flex>
                                        <v-flex xs4 sm5 style="overflow-wrap: break-word;" class="align-end">{{ item.price }}</v-flex>
                                        <v-flex  xs2 sm1 class="align-end" v-if="usersProfile">
                                            <v-btn fab small dark flat color="red" class="ma-0" @click="removeSub(i)">
                                                <v-icon dark>clear</v-icon>
                                            </v-btn>
                                        </v-flex>
                                        </v-layout>
                                        </v-container>
                                    </v-layout>
                                <v-divider></v-divider>
                                        <form @submit.prevent="addSub">
                                <v-card-actions v-if="usersProfile">
                                    <v-layout row align-center>
                                        <v-flex xs5 class="mr-2">
                                            <v-text-field
                                                    name="sub"
                                                    placeholder="Fag"
                                                    id="sub"
                                                    v-model="sub"
                                                    type="sub"
                                                    style="border:1px solid #ccc; border-radius: 1px;"
                                                    solo
                                                    hide-details
                                                    flat
                                                    required></v-text-field>
                                        </v-flex>
                                        <v-flex xs5 class="mr-1">
                                            <v-text-field
                                                    name="price"
                                                    placeholder="Pris"
                                                    id="price"
                                                    v-model="price"
                                                    type="price"
                                                    solo
                                                    style="border:1px solid #ccc; border-radius: 1px;"
                                                    hide-details
                                                    flat
                                                    required></v-text-field>
                                        </v-flex>
                                        <v-flex xs1 class="ml-1">
                                            <v-btn fab small dark flat color="green" type="submit">
                                                <v-icon dark>add</v-icon>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-card-actions>
                                        </form>
                            </v-card>
                            <v-card v-else flat style="border: 1px solid #ccc" >
                                <v-container>
                                    <v-layout row>
                                        <v-flex xs12 class="text-xs-center">
                                            <v-img
                                             :src="require('../../assets/blackboard.jpg')"
                                             contain
                                             height="200"
                                             ></v-img>
                                            <h3 style="color:#455A64">Underviser ingen fag</h3>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-flex>
                    </v-layout>
            <v-layout row wrap class="mt-2">
                <v-flex>
                    <v-card flat style="border: 1px solid #ccc">
                        <v-layout row wrap v-if="rev.length != 0">
                            <v-container>
                                <v-layout row wrap v-for="(r,i) in rev" :key="`${i}-${r}`">
                                    <v-flex xs12>
                                        {{ r.review }}
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-layout>
                        <v-layout row v-else>
                            <v-container>
                                <v-layout row wrap>
                            <v-flex xs12 class="text-xs-center">
                                <v-img
                                 :src="require('../../assets/rev.jpg')"
                                 contain
                                 height="200"
                                 ></v-img>
                                <h3 style="color:#455A64">Ingen omtaler</h3>
                            </v-flex>
                                </v-layout>
                            </v-container>
                        </v-layout>
                            <v-divider></v-divider>
                            <v-layout row v-if="!usersProfile">
                                <v-flex xs12>
                                    <v-textarea
                                        label="Skrive en omtale"
                                        v-model="review"
                                        
                                        solo
                                        flat
                                        hide-details
                                        required>
                                    </v-textarea>
                                    <v-btn small flat outline fab class="success success--text" @click="addRev"><v-icon>add</v-icon></v-btn>
                                </v-flex>
                            </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
                    <v-btn
                        block
                        flat
                                                                       outline
                                                                            v-if="!usersProfile"
                                                                            @click="toMess"
                        class="primary primary--text mt-2">
                        Send melding</v-btn>
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
            price: '',
            review: '',
            edit: false
        }
    },
    computed: {
        user(){
            return this.$store.getters.user
        },
        getUser (){
            return this.$store.getters.getUser
        },
        usersProfile(){
            return this.$store.getters.user.id === this.id
        },
        rev(){
            return this.$store.getters.rev
        },
        error(){
            return this.$store.getters.error
        },
        someSave(){
            if (this.study !== this.$store.getters.user.study || this.bio !== this.$store.getters.user.bio){
                return false
            }
            return true
        },
        loading(){
            return this.$store.getters.loading
        }
    },
    methods: {
        toMess(){
            this.$router.push('/chat/' + this.$props.id)
        },
        addSub(){
            if(this.sub === '' || this.price === ''){
                return
            }
            if (!this.subList){
                this.subList = []
            }
            this.subList.push({
                sub: this.sub,
                price: this.price
            })
            this.$store.dispatch('updateUser', {
                id: this.user.id,
                subList: this.subList,
            })
            this.price = ''
            this.sub = ''
        },
        addRev(){
            if(this.review === ''){
                return
            }
            this.$store.dispatch('addRev', {
                id: this.user.id,
                to: this.$props.id,
                rev: this.review
            })
        },
        removeSub(i){
            this.$store.dispatch('removeSub',i)
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
            if (this.someSave){
                return
            }
            this.$store.dispatch('updateUser', {
                id: this.user.id,
                study: this.study,
                bio: this.bio,
            })
            this.edit = !this.edit
        },
        makeEdit(){
            this.name = this.getUser(this.$props.id).name
            this.study = this.getUser(this.$props.id).study
            this.bio = this.getUser(this.$props.id).bio
            this.subList = this.getUser(this.$props.id).subList
            this.edit = !this.edit
        }
    },
    updated(){
        this.subList = this.getUser(this.$props.id).subList
    },
    mounted() {
            this.name = this.getUser(this.$props.id).name
            this.study = this.getUser(this.$props.id).study
            this.bio = this.getUser(this.$props.id).bio
            this.subList = this.getUser(this.$props.id).subList
    }
} 
</script>
