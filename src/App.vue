<script setup lang="ts">
import {ref} from 'vue'
import port from "./port"


var lastMessage = ref({})
port.onMessage.addListener((msg) => {
  debugger
  console.log("in App.vue. message made it all the way")
  console.log(msg)
  alert(JSON.stringify(msg))
  lastMessage = msg
});

</script>

<template>
{{JSON.stringify(lastMessage) }}
  <img src="/images/octopus-photo.png" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
