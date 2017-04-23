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

<style>
  /*hack: changes the font awesome font locations to the node_modules*/
  @font-face {
    font-family: 'FontAwesome';
    src: url('../../node_modules/font-awesome/fonts/fontawesome-webfont.eot?v=4.7.0');
    src: url('../../node_modules/font-awesome/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('../../node_modules/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('../../node_modules/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('../../node_modules/font-awesome/fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('../../node_modules/font-awesome/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');
    font-weight: normal;
    font-style: normal;
  }
</style>
