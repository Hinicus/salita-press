<template>
  <div
    class="d-flex flex-row align-items-start gap-4 p-4 border rounded-3 shadow-sm mb-3">
    <div class="d-flex flex-column align-items-center flex-shrink-0">
      <div class="p-3 bg-secondary-subtle text-dark rounded">
        <i class="bi bi-person-fill display-5 m-0"></i>
      </div>
      <p class="fw-semibold mt-2 mb-0">{{ blogPost.author.username }}</p>
    </div>

    <div class="d-flex flex-column flex-grow-1">
      <h3 class="fw-bold text-color">{{ blogPost.title }}</h3>
      <p class="text-muted mb-0">
        {{ truncate(blogPost.content, 350) }}
      </p>
      <div class="d-flex gap-3 align-items-center ms-auto">
        <p class="text-muted m-0">comments ({{ blogPost.comments.length }})</p>
        <router-link
          class="btn btn-outline-primary ms-auto"
          :to="`/blogs/${blogPost._id}`"
          >Read More</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  blogPost: {
    type: Object,
    required: true,
  },
});

const truncate = (text, maxLength = 250) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
};
</script>
