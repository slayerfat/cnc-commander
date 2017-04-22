<template>
  <div class="container">
    <table class="table">
      <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th><abbr title="Correo Electrónico">Email</abbr></th>
      </tr>
      </thead>
      <tfoot>
      <tr>
        <th>Id</th>
        <th>Name</th>
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
</template>

<script>
  import { UserRepository } from '../../../database/repositories/user';

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
