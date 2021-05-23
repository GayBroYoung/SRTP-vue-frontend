<template>
  <div class="back-ground">
    <router-view>
    </router-view>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'


export default {
  name: 'App',
  components: {
    HelloWorld
  },

}
</script>

<style scoped>
.back-ground{
  background-color: #f0f0f0;
}
</style>
