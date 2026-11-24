<template>
  <nav
    id="navbar"
    class="navbar navbar-expand-lg salita-nav-footer text-color sticky-top">
    <div class="container">
      <a class="navbar-brand fw-bold fs-3 salita-press">
        <i class="bi bi-book-half"></i>
        Salita Press</a
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li>
            <router-link class="nav-link active" aria-current="page" to="/">
              <i class="bi bi-house-fill me-1"></i>
              Home</router-link
            >
          </li>
          <li>
            <router-link
              class="nav-link active"
              aria-current="page"
              to="/admin"
              v-if="user.isAdmin && user.email">
              <i class="bi bi-patch-check-fill me-1"></i>
              Admin Dashboard</router-link
            >
          </li>
          <li>
            <router-link
              class="nav-link active"
              aria-current="page"
              to="/register"
              v-if="!user.email">
              <i class="bi bi-clipboard me-1"></i>
              Register</router-link
            >
          </li>
          <li>
            <router-link
              class="nav-link active"
              aria-current="page"
              to="/login"
              v-if="!user.email">
              <i class="bi bi-person-fill me-1"></i>
              Login</router-link
            >
          </li>
          <li>
            <router-link
              class="nav-link active"
              aria-current="page"
              to="/blogs/post"
              v-if="user.email">
              <i class="bi bi-pencil me-1"></i>
              Write a blog</router-link
            >
          </li>
          <li>
            <router-link
              class="nav-link active"
              aria-current="page"
              to="/logout"
              v-if="user.email">
              <i class="bi bi-door-open-fill me-1"></i>
              Logout</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useGlobalStore } from "../stores/global";
const { user } = useGlobalStore();
</script>
