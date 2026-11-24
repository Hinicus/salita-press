<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import { Notyf } from "notyf";
import { useGlobalStore } from "../stores/global";
const { user } = useGlobalStore();
const notyf = new Notyf();
const router = useRouter();

const title = ref("");
const content = ref("");
const loading = ref(false);
const error = ref("");

// Disable submit until both title and content have non-whitespace text
const isEnabled = computed(() => {
  return title.value.trim() !== "" && content.value.trim() !== "";
});

const handleSubmit = async () => {
  if (!isEnabled.value || loading.value) return;

  loading.value = true;
  error.value = "";

  try {
    const res = await api.post("/blogs/post", {
      title: title.value.trim(),
      content: content.value.trim(),
    });

    //go to newly created blog
    const createdId = res.data?.post?._id;
    if (createdId) {
      router.push(`/blogs/${createdId}`);
    } else {
      router.push("/");
    }

    notyf.success("Post successfully created!   ");
  } catch (err) {
    console.error(err.response.data);
    error.value =
      err.response?.data?.message ||
      "Failed to publish your post. Please try again.";
    notyf.error(error.value);
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  if (!user.token) {
    router.push("/");
    notyf.error("Please Log in, first!");
  }
});
</script>

<template>
  <main class="container py-5 create-blog-container">
    <!-- Back Link -->
    <router-link
      to="/"
      class="text-decoration-none back-link d-inline-flex align-items-center gap-1 mb-4">
      <i class="bi bi-arrow-left"></i>
      <span>Back to Blogs</span>
    </router-link>

    <!-- Page Header -->
    <div class="mb-4">
      <h1 class="fw-bold salita-text mb-1">Write a Blog</h1>
      <p class="text-muted mb-0">
        Share your thoughts with the Salita Press community.
      </p>
    </div>

    <!-- Form Card -->
    <form
      @submit.prevent="handleSubmit"
      class="p-4 p-md-5 rounded-3 border shadow-sm salita-card">
      <!-- Title Input -->
      <div class="mb-4">
        <label for="blogTitle" class="form-label fw-semibold salita-text">
          Title
        </label>
        <input
          id="blogTitle"
          v-model="title"
          type="text"
          class="form-control form-control-lg salita-input"
          placeholder="Give your story a compelling title..."
          required />
      </div>

      <!-- Content Textarea -->
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <label
            for="blogContent"
            class="form-label fw-semibold salita-text mb-0">
            Content
          </label>
          <small class="text-muted"> {{ content.length }} characters </small>
        </div>
        <textarea
          id="blogContent"
          v-model="content"
          rows="10"
          class="form-control salita-input"
          placeholder="Start writing your story here..."
          required></textarea>
      </div>

      <!-- Actions -->
      <div class="d-flex justify-content-end align-items-center gap-2 pt-2">
        <router-link to="/" class="btn btn-outline-secondary px-4">
          Cancel
        </router-link>
        <button
          type="submit"
          class="btn btn-salita px-4"
          :disabled="!isEnabled || loading">
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"></span>
          {{ loading ? "Publishing..." : "Publish Post" }}
        </button>
      </div>
    </form>
  </main>
</template>
