<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <h1 class="gray--text">Legg til et nytt kurs</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <form @submit.prevent="onCreateMeetup">
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                name="title"
                                label="Tittel"
                                id="title"
                                v-model="title"
                                required
                                ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                name="locat"
                                label="Sted og/eller pris"
                                id="locat"
                                v-model="locat"
                                required></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn raised @click="onPickFile">Last opp bildet</v-btn>
                            <input type="file" style="display: None" ref="fileInput" accept="image/*" @change="onFilePicked"></input>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <img :src="imageUrl" height="150">
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-textarea
                                name="desc"
                                label="Detaljer"
                                id="desc"
                                v-model="desc"
                                required></v-textarea>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <h4>Velg tid og sted</h4>
                        </v-flex>
                    </v-layout>
                    <v-layout row class="mb-2">
                        <v-flex xs12 sm6 offset-sm3>
                            <v-date-picker v-model="dated">
                            </v-date-picker>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-time-picker 
                                v-model="time"
                                format="24hr">
                            </v-time-picker>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn 
                                class="red white--text" 
                                :disabled="!formIsValid"
                                type="submit">Lag nytt kurs</v-btn>
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>
    </v-container> 
</template>

<script>
    export default {
        data () {
            return {
                title: '',
                locat: '',
                desc: '',
                imageUrl: '',
                dated: '',
                time: new Date(),
                image: null
            }
         },
        computed: {
            formIsValid() {
                return this.title !== '' && this.locat !== '' && this.desc !== '' && this.imageUrl !== ''
            },
            submitableTime(){
                const dated = new Date(this.dated)
                if (typeof this.time === 'string') {
                    const hours = this.time.match(/^(\d+)/)[1]
                    const min = this.time.match(/:(\d+)/)[1]
                    dated.setHours(hours)
                    dated.setMinutes(min)
                } else {
                    dated.setHours(this.time.getHours())
                    dated.setMinutes(this.time.getMinutes())
                }
                return dated
            }
        },
        methods: {
            onCreateMeetup(){
                if (!this.formIsValid){
                    return
                }
                if (!this.image){
                   return 
                }
                const meetupData = {
                    title: this.title,
                    loc: this.locat,
                    desc:  this.desc,
                    image: this.image,
                    dated: this.submitableTime
                }
                this.$store.dispatch('createMeetup', meetupData)
                this.$router.push('/meetups')
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
                    this.imageUrl = fileReader.result
                })
                fileReader.readAsDataURL(files[0])
                this.image = files[0]

            }
        }
    } 
</script>

