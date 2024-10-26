<template>
  <div id="app">
    <ShortestPath />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ShortestPath from '@/components/ShortestPath.vue'

export default defineComponent({
  name: 'App',
  components: {
    ShortestPath
  }
})
</script>

<style>
#app {
  text-align: center;
}
/* Background */
body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(to bottom, #1a4a83  40%, #e3f0ff 40%);
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
</style>
