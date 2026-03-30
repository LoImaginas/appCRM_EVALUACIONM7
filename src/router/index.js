import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import LoginView from '../views/LoginView.vue';
import UsersView from '../views/UsersView.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/users'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth) && !store.getters.isAuthenticated) {
    next('/login');
    return;
  }

  if (to.path === '/login' && store.getters.isAuthenticated) {
    next('/users');
    return;
  }

  next();
});

export default router;
