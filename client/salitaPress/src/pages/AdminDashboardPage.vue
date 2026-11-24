<template>
  <section class="d-flex flex-column align-items-center flex-grow-1 w-100 p-5">
    <h1 class="fw-semibold salita-press">Admin Dashboard</h1>

    <div class="d-flex justify-content-center" v-if="isLoading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <table
      class="table border border-dark rounded-3 table-striped w-75 align-middle">
      <thead>
        <tr class="table-dark">
          <th scope="col">id</th>
          <th scope="col">Title</th>
          <th scope="col">Content</th>
          <th scope="col">Author</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody v-for="post in blogPosts">
        <tr>
          <th scope="row">
            <router-link :to="`/blogs/${post._id}`">{{ post._id }}</router-link>
          </th>
          <td>{{ post.title }}</td>
          <td>{{ post.content }}</td>
          <td>{{ post.author.username }}</td>
          <td>
            <button
              class="btn btn-sm btn-danger d-flex"
              :disabled="deletingId === post._id"
              @click="deletePost(post._id)">
              <i class="bi bi-trash"></i>
              {{ deletingId === post._id ? "Deleting..." : "Delete" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import api from "../api";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";
import { ref, onMounted, onBeforeMount } from "vue";
import { Notyf } from "notyf";

const notyf = new Notyf();
const router = useRouter();
const { user } = useGlobalStore();

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

const deletingId = ref(null);

async function deletePost(id) {
  deletingId.value = id;
  try {
    const res = await api.delete(`/blogs/delete/${id}`);

    if (res.status === 200 || res.status === 204) {
      blogPosts.value = blogPosts.value.filter((post) => post._id !== id);
      notyf.success("Post successfully deleted!");
    }
  } catch (e) {
    if (e.response?.status === 403) {
      return notyf.error(e.response.data.message);
    }
    notyf.error(`${e.response?.data?.message || "Error! Contact admin!"}`);
  } finally {
    deletingId.value = null;
  }
}

onBeforeMount(() => {
  if (!user.isAdmin) {
    router.push("/");
    notyf.error("Unauthorized access");
  }
});

onMounted(fetchPosts);
</script>
