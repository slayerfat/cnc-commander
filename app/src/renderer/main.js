import Vue from 'vue';
import Electron from 'vue-electron';
import Resource from 'vue-resource';
import Router from 'vue-router';
import VeeValidate, { Validator } from 'vee-validate';
import es from 'vee-validate/dist/locale/es';
import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css';

import App from './App.vue';
import routes from './routes';

Vue.use(Electron);
Vue.use(Resource);
Vue.use(Router);

// Add locale helper.
Validator.addLocale(es);

// form validations
Vue.use(VeeValidate, {locale: 'es'});
Vue.config.debug = true;

const router = new Router({
  scrollBehavior: () => ({y: 0}),
  linkActiveClass: 'is-active',
  routes
});

new Vue({
  router,
  ...App
}).$mount('#app');
