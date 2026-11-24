<template></template>

<script setup>
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";
import { Notyf } from "notyf";
const notyf = new Notyf();
const { getUserDetails } = useGlobalStore();
const router = useRouter();

onBeforeMount(() => {
  localStorage.clear();
  getUserDetails(null);
  notyf.success("Successfully Logged out!");
  router.push("/");
});
</script>
