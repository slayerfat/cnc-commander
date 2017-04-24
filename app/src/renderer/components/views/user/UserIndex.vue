<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Usuarios en el sistema</h1>
      <router-link to="/users/create" class="button">Crear nuevo usuario</router-link>

      <hr>

      <table class="table">
        <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th><abbr title="Correo Electrónico">Email</abbr></th>
        </tr>
        </thead>
        <tfoot>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th><abbr title="Correo Electrónico">Email</abbr></th>
        </tr>
        </tfoot>
        <tbody>
        <tr v-for="user in users">
          <th>{{ user.id }}</th>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
  import { UserRepository } from '../../../../database/repositories/UserRepository';

  export default {
    data() {
      return {
        users: []
      };
    },

    created() {
      UserRepository.getInstance()
        .findAll()
        .then(response => this.users = response.users);
    }
  };
</script>
