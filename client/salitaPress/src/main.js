import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "notyf/notyf.min.css";
import "./style.css";
import App from "./App.vue";
import { createWebHistory, createRouter } from "vue-router";
import { createPinia } from "pinia";

//components
import Home from "./pages/Home.vue";
import BlogPostPage from "./pages/BlogPostPage.vue";
import RegisterLoginPage from "./pages/RegisterLoginPage.vue";
import LogoutPage from "./pages/LogoutPage.vue";
import AddBlog from "./pages/AddBlog.vue";
import AdminDashboardPage from "./pages/AdminDashboardPage.vue";

//routes
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: Home,
      component: Home,
    },
    {
      path: "/blogs/:id",
      name: "BlogSpecific",
      component: BlogPostPage,
    },
    {
      path: "/blogs/post",
      name: "BlogPost",
      component: AddBlog,
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterLoginPage,
    },
    {
      path: "/login",
      name: "Login",
      component: RegisterLoginPage,
    },
    {
      path: "/logout",
      name: "Logout",
      component: LogoutPage,
    },
    // admin routes
    {
      path: "/admin",
      name: "admin",
      component: AdminDashboardPage,
    },
  ],
});

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");
