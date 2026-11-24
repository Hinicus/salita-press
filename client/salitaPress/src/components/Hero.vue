<template>
  <header
    class="py-5 text-center text-white d-flex align-items-center hero-img">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="display-4 fw-bold mb-3 salita-press">Salita Press</h1>
          <p class="lead mb-4">
            Your thoughts, your voice, your platform. Publish stories that
            matter and connect with readers, one salita at a time.
          </p>
          <router-link
            class="btn btn-salita btn-lg px-4 me-2"
            :to="`/blogs/post`">
            Start Writing</router-link
          >
          <a href="#blogs" class="btn btn-outline-light btn-lg px-4">Browse</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup></script>
