import { createRouter, createWebHistory, RouteMeta, RouteRecordRaw } from 'vue-router';
import { ROUTE_NAMES } from '../types/types';

// Lazy load components for better performance
const UsersList = () => import('../components/UsersList.vue');
const UserProfilePage = () => import('../components/UserProfilePage.vue');

// Inline NotFound component to avoid import issues
const NotFound = {
  template: `
    <div class="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/" class="back-link">Go back to home</router-link>
    </div>
  `,
  name: 'NotFound'
};

const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    redirect: '/random-users'
  },
  {
    path: '/random-users',
    name: ROUTE_NAMES.RANDOM_USERS,
    component: UsersList,
    props: { isRandom: true },
    meta: {
      title: 'Random Users'
    } as RouteMeta
  },
  {
    path: '/history',
    name: ROUTE_NAMES.HISTORY,
    component: UsersList,
    props: { isRandom: false },
    meta: {
      title: 'Saved Profiles'
    } as RouteMeta
  },
  {
    path: '/user/:id',
    name: ROUTE_NAMES.USER_PROFILE,
    component: UserProfilePage,
    props: true,
    meta: {
      title: 'User Profile'
    } as RouteMeta
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: NotFound,
    meta: {
      title: 'Page Not Found'
    } as RouteMeta
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach((to, from, next) => {
  console.log('Router guard:', {
    to: to.path,
    from: from.path
  });

  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - User Management`;
  }

  console.log('Proceeding to route');
  next();
});

// Global error handler
router.onError((error) => {
  console.error('Router error:', error);
  // You could send this to an error reporting service
});

export default router;