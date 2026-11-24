<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import { Notyf } from "notyf";
import { useGlobalStore } from "../stores/global";

const { user } = useGlobalStore();

const notyf = new Notyf();

const route = useRoute();
const router = useRouter();

const blog = ref(null);
const loading = ref(true);
const error = ref(null);

// Comment form state
const newComment = ref("");
const submittingComment = ref(false);

// Edit & Delete state
const isEditing = ref(false);
const editTitle = ref("");
const editContent = ref("");
const isUpdating = ref(false);
const isDeleting = ref(false);

const formatDate = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isEdited = computed(() => {
  if (!blog.value) return false;
  return blog.value.updatedAt !== blog.value.createdAt;
});

// Check if the logged-in user is the post's author
const isAuthor = computed(() => {
  if (!blog.value || !user.id) return false;
  return blog.value.author?._id === user.id;
});

const canDelete = computed(() => {
  return isAuthor.value || Boolean(user.isAdmin);
});

// Non-mutating reversed comments list
const reversedComments = computed(() => {
  if (!blog.value?.comments) return [];
  return [...blog.value.comments].reverse();
});

const fetchBlog = async () => {
  loading.value = true;
  error.value = null;

  try {
    const res = await api.get(`/blogs/${route.params.id}`);
    blog.value = res.data;
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || "Error in displaying blog!";
    notyf.error(error.value);
  } finally {
    loading.value = false;
  }
};

// Enter inline edit mode
const startEditing = () => {
  editTitle.value = blog.value.title;
  editContent.value = blog.value.content;
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  editTitle.value = "";
  editContent.value = "";
};

const handleUpdatePost = async () => {
  if (
    !editTitle.value.trim() ||
    !editContent.value.trim() ||
    isUpdating.value
  ) {
    return;
  }

  isUpdating.value = true;
  try {
    const { data } = await api.patch(`/blogs/update/${route.params.id}`, {
      title: editTitle.value.trim(),
      content: editContent.value.trim(),
    });

    // Update fields directly so populated author & comments stay intact
    blog.value.title = data.updatedPost.title;
    blog.value.content = data.updatedPost.content;
    blog.value.updatedAt = data.updatedPost.updatedAt;

    isEditing.value = false;
    notyf.success(data.message || "Post successfully updated!");
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to update post.");
  } finally {
    isUpdating.value = false;
  }
};

const handleDeletePost = async () => {
  if (isDeleting.value) return;
  if (
    !window.confirm(
      "Are you sure you want to delete this post? This cannot be undone.",
    )
  ) {
    return;
  }

  isDeleting.value = true;
  try {
    const { data } = await api.delete(`/blogs/delete/${route.params.id}`);
    notyf.success(data.message || "Post successfully deleted!");
    router.push("/");
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to delete post.");
  } finally {
    isDeleting.value = false;
  }
};

const handleAddComment = async () => {
  if (!newComment.value.trim()) return;
  submittingComment.value = true;

  try {
    await api.patch(`/blogs/${route.params.id}/comment`, {
      comment: newComment.value.trim(),
    });

    await fetchBlog();
    newComment.value = "";
    notyf.success("Comment added!");
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to post comment!");
  } finally {
    submittingComment.value = false;
  }
};

onMounted(fetchBlog);
</script>

<template>
  <main class="container py-5 blog-container">
    <!-- Top Navigation & Author Controls -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <router-link
        to="/"
        class="text-decoration-none back-link d-inline-flex align-items-center gap-1">
        <i class="bi bi-arrow-left"></i>
        <span>Back to Blogs</span>
      </router-link>

      <!-- Author Action Buttons -->
      <div v-if="blog && canDelete && !isEditing" class="d-flex gap-2">
        <button
          v-if="isAuthor"
          type="button"
          class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
          :disabled="isDeleting"
          @click="startEditing">
          <i class="bi bi-pencil"></i>
          <span>Edit</span>
        </button>
        <button
          v-if="canDelete"
          type="button"
          class="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
          :disabled="isDeleting"
          @click="handleDeletePost">
          <span
            v-if="isDeleting"
            class="spinner-border spinner-border-sm"
            role="status"></span>
          <i v-else class="bi bi-trash"></i>
          <span>{{ isDeleting ? "Deleting..." : "Delete" }}</span>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      Loading story...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-light border text-center py-4">
      <p class="mb-2 fw-semibold">{{ error }}</p>
      <router-link to="/" class="btn btn-sm btn-salita">
        Return Home
      </router-link>
    </div>

    <!-- Blog Content -->
    <article v-else-if="blog">
      <!-- INLINE EDIT FORM -->
      <form
        v-if="isEditing"
        @submit.prevent="handleUpdatePost"
        class="p-4 rounded-3 border mb-5 salita-card">
        <h5 class="fw-semibold mb-3 salita-text">Edit Story</h5>

        <div class="mb-3">
          <label for="editTitle" class="form-label fw-semibold salita-text">
            Title
          </label>
          <input
            id="editTitle"
            v-model="editTitle"
            type="text"
            class="form-control form-control-lg salita-input"
            required />
        </div>

        <div class="mb-4">
          <label for="editContent" class="form-label fw-semibold salita-text">
            Content
          </label>
          <textarea
            id="editContent"
            v-model="editContent"
            rows="8"
            class="form-control salita-input"
            required></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-outline-secondary px-3"
            :disabled="isUpdating"
            @click="cancelEditing">
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-salita px-4"
            :disabled="isUpdating || !editTitle.trim() || !editContent.trim()">
            {{ isUpdating ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>

      <!-- READ VIEW -->
      <template v-else>
        <!-- Header -->
        <header class="mb-4 pb-4 border-bottom salita-border">
          <h1 class="fw-bold display-6 mb-4 salita-text">
            {{ blog.title }}
          </h1>

          <div class="d-flex align-items-center gap-3">
            <div
              class="avatar-box d-flex align-items-center justify-content-center rounded-circle">
              <i class="bi bi-person-fill fs-5"></i>
            </div>
            <div>
              <p class="fw-semibold mb-0 salita-text">
                {{ blog.author?.username || "Anonymous" }}
              </p>
              <small class="text-muted">
                Published {{ formatDate(blog.createdAt) }}
                <span v-if="isEdited">
                  · Updated {{ formatDate(blog.updatedAt) }}
                </span>
              </small>
            </div>
          </div>
        </header>

        <!-- Body -->
        <section class="blog-body mb-5 salita-text">
          {{ blog.content }}
        </section>
      </template>

      <!-- Comments Section -->
      <section class="pt-4 border-top salita-border">
        <h4 class="fw-semibold mb-4 salita-text">
          Comments ({{ blog.comments?.length || 0 }})
        </h4>

        <!-- Add Comment Form -->
        <form
          @submit.prevent="handleAddComment"
          class="mb-4"
          v-if="user?.email">
          <div class="mb-2">
            <textarea
              v-model="newComment"
              rows="3"
              class="form-control salita-input"
              placeholder="Share your thoughts on this post..."
              required></textarea>
          </div>
          <div class="d-flex justify-content-end">
            <button
              type="submit"
              class="btn btn-salita px-4"
              :disabled="submittingComment || !newComment.trim()">
              {{ submittingComment ? "Posting..." : "Post Comment" }}
            </button>
          </div>
        </form>

        <!-- User is not logged in -->
        <div
          class="d-flex flex-column align-items-center mb-3 border p-3 py-5 rounded comment-card"
          v-else>
          <p class="blog-body salita-text">Join the conversation!</p>
          <router-link class="btn btn-salita" to="/login">Log in</router-link>
        </div>

        <!-- Comment List -->
        <div v-if="reversedComments.length" class="d-flex flex-column gap-3">
          <div
            v-for="item in reversedComments"
            :key="item._id"
            class="p-3 rounded-3 border comment-card">
            <div class="d-flex align-items-center gap-2 mb-2">
              <div
                class="avatar-sm d-flex align-items-center justify-content-center rounded-circle">
                <i class="bi bi-person-fill small"></i>
              </div>
              <span class="fw-semibold small salita-text">
                {{ item.userId?.username || "Unknown User" }}
              </span>
            </div>
            <p class="mb-0 salita-text comment-text">
              {{ item.comment }}
            </p>
          </div>
        </div>

        <!-- Empty Comments State -->
        <p v-else class="text-muted fst-italic">
          No comments yet. Be the first to start the conversation!
        </p>
      </section>
    </article>
  </main>
</template>
