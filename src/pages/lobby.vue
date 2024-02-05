<script setup lang="ts">
import {ref} from "vue";
import type {Ref} from "vue";
import {useRouter} from "vue-router";

const id = ref("");
const router = useRouter();

const props = defineProps<{
    ws: WebSocket,
}>();

const ws = props.ws;

if (!ws) {
    router.push("/");
}

const Messages = {
    PlayerList: "player_list",
    StartGame: "start_game",
    NameUpdate: "name_update",
    PlayerID: "player_id",
}

type Message = {
    type: string,
    message: any,
}

function message(type: string, data) {
    ws.send(JSON.stringify({
        type: type,
        message: data,
    }));
}

type Player = {
    name: string,
    meeples: number,
    score: number,
    id: string,
    pieces: {
        builder: number,
        pig: number
    }
}

const players: Ref<Array<Player>> = ref([]);

ws.onmessage = (e: MessageEvent) => {
    const msg: Message = JSON.parse(e.data);
    if (msg.type === Messages.PlayerList) {
        players.value = msg.message as Array<Player>;
    } else if (msg.type === Messages.PlayerID) {
        id.value = msg.message;
    } else if (msg.type === Messages.StartGame) {
        ws.onmessage = null;
        router.push("/game");
    }
};
</script>

<template>
    Players:
    <ul>
        <li v-for="player in players" :key="player.name">
            {{player.name}}
            <span v-if="player.id === id" class="text-green-500">(YOU)</span>
        </li>
    </ul>
    <button @click="message(Messages.StartGame, 0)">Start Game</button>
</template>

<style scoped>

</style>