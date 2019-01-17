<template>
    <v-app>
        <v-toolbar flat app dark class="primary" >
            <v-toolbar-side-icon @click="sideNav = !sideNav" class="hidden-sm-and-up" v-if="userIsAuth"></v-toolbar-side-icon>
            <v-toolbar-title class="headline text-uppercase">
                <router-link to="/" tag="span" style="cursor: pointer">
                    <v-icon left large class="mr-2">donut_small</v-icon>
                    <span>SC</span>
                    <span class="font-weight-light">OPE</span>
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only">
                <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link">

                    <v-badge left color="red">
                        <span slot="badge" v-if="item.title === 'Chat' && notf > 0">{{ notf }}</span>
                        <v-icon left>{{ item.icon }}</v-icon>
                    </v-badge>
                    {{ item.title }}
                </v-btn>
                <v-btn flat v-if="userIsAuth" @click="onLogout">
                    <v-icon left>exit_to_app</v-icon>
                    Log Out
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-navigation-drawer temporary v-model="sideNav" fixed v-if="userIsAuth">
            <v-list>
                <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        {{ item.title }}
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if="userIsAuth" @click="onLogout">
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        Log Out
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data () {
        return {
            sideNav: false,
        }
    },
    computed: {
        menuItems () {
            let menuItems = [
                    { icon: 'date_range', title: 'Bestillinger', link: '/requests' },
                    { icon: 'school', title: 'Finn Mentor', link: '/mentors' },
                    { icon: 'assignment', title: 'Personvern og kontakt info', link: '/policy' },
            ]
            if (this.userIsAuth) {
                menuItems = [
                    { icon: 'date_range', title: 'Bestillinger', link: '/requests' },
                    { icon: 'school', title: 'Finn Mentor', link: '/mentors' },
                    { icon: 'person', title: 'Profil', link: '/profile/' + this.$store.getters.user.id },
                    { icon: 'question_answer', title: 'Chat', link: '/chatlist' },
                ]
            }
            return menuItems
        },
        userIsAuth () {
            return this.$store.getters.user !== null && this.$store.getters.user !== undefined
        },
        notf(){
            return this.$store.getters.notf
        },
    },
    methods: {
        onLogout() {
            this.$store.dispatch('logout')
            this.$router.push('/')
        }
    }
}
</script>

<style>
* {
    overflow-wrap: break-word;
}
</style>
