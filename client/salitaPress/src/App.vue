<script setup>
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
import { useGlobalStore } from "./stores/global";
import { onBeforeMount } from "vue";
const { getUserDetails } = useGlobalStore();

onBeforeMount(() => {
  getUserDetails(localStorage.getItem("token"));
});
</script>

<template>
  <div class="app-shell d-flex flex-column min-vh-100">
    <Navbar />

    <main class="app-main flex-grow-1">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
