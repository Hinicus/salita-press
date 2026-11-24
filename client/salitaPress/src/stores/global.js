import { defineStore } from "pinia";
import { reactive } from "vue";
import api from "../api";

export const useGlobalStore = defineStore("global", () => {
  const user = reactive({
    token: localStorage.getItem("token"),
    id: null,
    username: null,
    email: null,
    isAdmin: null,
  });

  async function getUserDetails(token) {
    if (!token) {
      user.token = null;
      user.id = null;
      user.username = null;
      user.email = null;
      user.isAdmin = null;
      return;
    }

    const { data } = await api.get("/users/details");
    user.token = token;
    user.id = data.user._id || data.user.id;
    user.username = data.user.username;
    user.email = data.user.email;
    user.isAdmin = data.user.isAdmin;
  }

  return {
    user,
    getUserDetails,
  };
});
