<template>
  <section id="blogs" class="mt-5 p-5 container">
    <h2 class="fw-semibold mb-5">Blogs</h2>

    <div class="d-flex justify-content-center" v-if="isLoading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <BlogPostCard
      v-else
      v-for="blogPost in blogPosts"
      :blogPost="blogPost"
      :key="blogPost._id" />
  </section>
</template>

<script setup>
import api from "../api.js";
import { ref, onMounted } from "vue";
import BlogPostCard from "./BlogPostCard.vue";
import { Notyf } from "notyf";
const notyf = new Notyf();
const isLoading = ref(false);
const blogPosts = ref([]);
async function fetchPosts() {
  isLoading.value = true;
  try {
    const { data } = await api.get("/blogs/");
    blogPosts.value = data;
    console.log(blogPosts);
  } catch (e) {
    notyf.error(`${e.response?.error?.message || "Error! Contact admin!"}`);
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchPosts);
</script>
