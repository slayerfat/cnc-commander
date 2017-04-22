<template>
  <div id="#app">
    <navbar></navbar>

    <router-view></router-view>

    <footer-default></footer-default>
  </div>
</template>

<script>
  import store from 'renderer/vuex/store';
  import NavbarComponent from './components/Navbar.vue';
  import FooterComponent from './components/Footer.vue';

  export default {
    components: {
      'navbar': NavbarComponent,
      'footer-default': FooterComponent
    },
    store
  };
</script>
