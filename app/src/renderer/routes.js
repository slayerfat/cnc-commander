export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/LandingPageView.vue')
  },
  {
    path: '/users',
    name: 'users-index',
    component: require('components/UserView/UserIndexView.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
];
