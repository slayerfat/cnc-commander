export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/views/landingPage/LandingPage.vue')
  },
  {
    path: '/users',
    name: 'users.index',
    component: require('components/views/user/UserIndex.vue')
  },
  {
    path: '/users/create',
    name: 'users.create',
    component: require('components/views/user/UserCreate.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
];
