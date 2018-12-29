<template>
    <v-alert
        @input="onClose"
        dismissible
        :type="code"
        :value="true"
        >
        {{ text }}
    </v-alert>
</template>

<script>
    export default {
        props: ['text', 'code'],
        methods: {
            onClose() {
                this.$emit('dismissed')
            }
        }
    }
</script>
