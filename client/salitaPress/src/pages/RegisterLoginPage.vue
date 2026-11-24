<template>
  <section
    class="d-flex flex-column justify-content-center align-items-center flex-grow-1 w-100">
    <h1 class="salita-press fw-semibold">
      {{ isRegistering ? "Register" : "Login" }}
    </h1>
    <form
      class="d-flex flex-column p-5 border rounded shadow w-100 form-user salita-nav-footer"
      @submit.prevent="handleSubmit">
      <div class="mb-3" v-if="isRegistering">
        <!-- username -->
        <label for="usernameInput" class="form-label">Username</label>
        <input
          type="text"
          class="form-control"
          id="usernameInput"
          placeholder="Veritas"
          v-model="username" />
      </div>
      <!-- email -->
      <div class="mb-3">
        <label for="emailInput" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="emailInput"
          placeholder="name@example.com"
          v-model="email" />
      </div>
      <!-- password -->
      <div class="mb-3">
        <label for="passwordInput" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="passwordInput"
          placeholder="•••••••••"
          v-model="password" />
      </div>
      <button
        class="btn btn-salita ms-auto"
        :disabled="!isEnabled || isLoading">
        {{ isRegistering ? "Register" : "Login" }}

        <span
          class="spinner-border spinner-border-sm text-center"
          role="status"
          v-if="isLoading">
          <span class="visually-hidden">Loading...</span>
        </span>
      </button>

      <p class="text-center mt-3" v-if="isRegistering">
        Have an account? <router-link to="/login">Login</router-link>
      </p>
      <p class="text-center mt-3" v-else>
        New User? <router-link to="/register">Register</router-link>
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeMount } from "vue";
import api from "../api";
import { Notyf } from "notyf";
import { useRouter, useRoute } from "vue-router";
import { useGlobalStore } from "../stores/global";

const notyf = new Notyf();
const router = useRouter();
const route = useRoute();
const { user, getUserDetails } = useGlobalStore();

const email = ref("");
const password = ref("");
const username = ref("");

//states
const isLoading = ref(false);
const isEnabled = ref(false);
const isRegistering = computed(() => route.path === "/register");

watch(
  [email, password, username, isRegistering],
  ([newEmail, newPassword, newUsername, registering]) => {
    const hasBasicFields = newEmail.trim() !== "" && newPassword.trim() !== "";

    const hasUsername = !registering || newUsername.trim() !== "";

    isEnabled.value = hasBasicFields && hasUsername;
  },
  { immediate: true },
);

watch(
  () => route.path,
  () => {
    username.value = "";
    email.value = "";
    password.value = "";
  },
);

async function handleSubmit() {
  const endpoint = isRegistering.value ? "/users/register" : "/users/login";

  try {
    isLoading.value = true;
    let request = {
      username: username.value,
      email: email.value,
      password: password.value,
    };
    //send request
    let res = await api.post(endpoint, request);

    if (isRegistering.value && res.status === 201) {
      notyf.success(res.data.response?.message || "Successfully registered!");
      router.push("/login");
    } else if (!isRegistering.value && res.status === 200) {
      localStorage.setItem("token", res.data.access);
      await getUserDetails(res.data.access);
      notyf.success("Successfully Logged in!");
      router.push("/");
    }
  } catch (e) {
    //login error handling
    if (e.response?.status === 401) {
      return notyf.error("Incorrect Email or Password!");
    } else if (e.response.status === 404) {
      return notyf.error("Email does not exist");
    }

    //register error handling
    if (e.response?.status === 400) {
      return notyf.error("Email is not valid or password's length is < 8");
    }

    console.error(e);
    console.error(e.response?.data?.error?.message || "Server Error");
    notyf.error(
      `${e ? e.response?.data?.error?.message : "Error! Contact admin."}`,
    );
  } finally {
    isLoading.value = false;
  }
}

onBeforeMount(() => {
  if (user.token) {
    router.push({ path: "/" });
  }
});
</script>
