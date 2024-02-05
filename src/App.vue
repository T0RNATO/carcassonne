<script setup>
import {RouterView, useRoute} from "vue-router";
import {ref, watch} from "vue";

const route = useRoute();

const ws = ref();

watch(route, (newVal) => {
    if (newVal.path !== "/") {
        console.log(ws.value);
        if (!ws.value) {
            ws.value = new WebSocket('ws://localhost:8001');
        }
    } else if (ws.value) {
        ws.value.close();
        ws.value = null;
    }
})
</script>

<template>
    <RouterView v-slot="{ Component }">
        <component
            :is="Component"
            :ws="ws"
        />
    </RouterView>
</template>

<style scoped>

</style>
