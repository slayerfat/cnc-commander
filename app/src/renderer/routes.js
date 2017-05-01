export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/views/landingPage/LandingPage.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: require('components/views/user/UserIndex.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
];
