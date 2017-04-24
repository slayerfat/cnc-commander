<template>
  <nav class="nav has-shadow">
    <div class="container">
      <div class="nav-left">
        <router-link to="/" class="nav-item">CNC Commander</router-link>
        <router-link to="/" class="nav-item is-hidden-mobile is-tab" exact>
          <i class="fa fa-home"></i>&nbsp;Inicio
        </router-link>
        <router-link to="/users" class="nav-item is-hidden-mobile is-tab" exact>
          <i class="fa fa-users"></i>&nbsp;Usuarios
        </router-link>
      </div>

      <span class="nav-toggle" @click="toggleNavMenu">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </div>

    <div class="nav-right nav-menu" :class="{'is-active': isNavMenuActive}">
      <router-link to="/" class="nav-item is-hidden-tablet" exact>
        <i class="fa fa-home"></i>&nbsp;Inicio
      </router-link>
      <router-link to="/users" class="nav-item is-hidden-tablet" exact>
        <i class="fa fa-users"></i>&nbsp;Usuarios
      </router-link>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'navbar',
    data() {
      return {
        isNavMenuActive: false
      };
    },
    methods: {
      toggleNavMenu() {
        this.isNavMenuActive = !this.isNavMenuActive;
      }
    }
  };
</script>
