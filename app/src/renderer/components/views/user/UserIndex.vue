<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Usuarios en el sistema</h1>
      <button class="button" @click="showUserFormModal = true">Crear nuevo usuario</button>

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
        <tr v-for="user in users" @click="onClickUserTableRow(user)">
          <th>{{ user.id }}</th>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="container">
      <user-form-modal @user-modal-closed="handleUserModalClosed"
                       v-bind:user="selectedUser"
                       v-if="showUserFormModal">
      </user-form-modal>
    </div>
  </section>
</template>

<script>
  import { UserRepository } from '../../../database/repositories/UserRepository';
  import UserFormModal from './components/UserFormModal.vue';

  export default {
    data() {
      return {
        unknownError: 'Error inesperado, contacte al administrador del sistema',
        users: [],
        selectedUser: {},
        showUserFormModal: false
      };
    },
    components: {
      'user-form-modal': UserFormModal
    },
    created() {
      UserRepository.getInstance()
        .findAll()
        .then(response => this.users = response.users)
        .catch(this.handleUnknownError);
    },
    methods: {
      handleUnknownError(error) {
        console.error(error);

        this.$root.$emit('main-notification', this.unknownError);
      },
      /**
       * Handles the users click on the table row and shows the modal.
       */
      onClickUserTableRow(user) {
        this.showUserFormModal = true;
        this.selectedUser      = Object.assign({}, user);
      },
      /**
       * Handles the closed modal event.
       *
       * @param {Object} payload
       */
      handleUserModalClosed(payload) {
        this.showUserFormModal = false;
        this.selectedUser      = null;

        // if there's no payload, we don't need to update the user list.
        if (!payload) {
          return;
        }

        if (payload && payload.wasCreating) {
          return this.users.push(payload.user);
        }

        const index = this.users.findIndex(user => user.id === payload.user.id);

        if (index === -1) {
          this.$root.$emit('main-notification', this.unknownError);

          console.error('The payloads user id did not match with any of the users inside the component.');
          console.error(this.users);
          console.error(payload);
        }

        this.users[index] = payload.user;
      }
    }
  };
</script>
