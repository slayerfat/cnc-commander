<template>
  <nav class="nav has-shadow">
    <div class="container">
      <div class="nav-left">
        <router-link to="/" class="nav-item">CNC Commander</router-link>
        <router-link to="/" class="nav-item is-hidden-mobile is-tab" exact>Inicio</router-link>
        <router-link to="/users" class="nav-item is-hidden-mobile is-tab" exact>Usuarios</router-link>
      </div>
      <span class="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'navbar'
  };
</script>
