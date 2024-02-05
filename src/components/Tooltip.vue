<script setup>
import {ref} from "vue";

defineProps({
    tip: String
})

const hover = ref(false);
</script>

<template>
        <slot/>
<!--    <teleport to="body" v-if="hover">-->
        <div class="absolute bg-black text-white tip hidden peer-hover:block">
            {{tip}}
        </div>
<!--    </teleport>-->
</template>

<style scoped>
.tip {
    transform: translateY(-200%);
}
</style>