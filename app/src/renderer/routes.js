export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/LandingPageView.vue')
  },
  {
    path: '/users',
    name: 'users.index',
    component: require('components/UserView/UserIndexView.vue')
  },
  {
    path: '/users/create',
    name: 'users.create',
    component: require('components/UserView/UserCreateView.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
];
