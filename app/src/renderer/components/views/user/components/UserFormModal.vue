<template>
  <div class="modal is-active">
    <div class="modal-background" @click="onClickClose"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button class="delete" @click="onClickClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Nombre</label>
          <p class="control">
            <input type="text"
                   name="name"
                   v-model="name"
                   placeholder="Por favor introduzca un nombre"
                   data-vv-as="Nombre"
                   v-validate="'required|alpha_num|max:16'"
                   :class="{'input': true, 'is-danger': errors.has('name') }">
          </p>
          <p class="help is-danger" v-show="errors.has('name')">
            {{ errors.first('name') }}
          </p>
        </div>

        <div class="field">
          <label class="label">Email</label>
          <p class="control">
            <input type="email"
                   name="email"
                   v-model="email"
                   placeholder="Ingrese el correo electrónico del usuario."
                   v-validate="'required|email'"
                   data-vv-as="Email"
                   :class="{'input': true, 'is-danger': errors.has('email') }">
          </p>
          <p class="help is-danger" v-show="errors.has('email')">
            {{ errors.first('email') }}
          </p>
        </div>

        <div class="field">
          <label class="label">Clave</label>
          <p class="control">
            <input type="password"
                   name="password"
                   v-model="password"
                   :placeholder="passwordPlaceholder"
                   v-validate="'alpha_dash|min:3|max:16'"
                   data-vv-as="Clave"
                   :class="{'input': true, 'is-danger': errors.has('password') }">
          </p>
          <p class="help is-danger" v-show="errors.has('password')">
            {{ errors.first('password') }}
          </p>
        </div>

        <div class="field">
          <label class="label">Confirmación de clave</label>
          <p class="control">
            <input type="password"
                   name="confirmation"
                   v-model="confirmation"
                   placeholder="Por favor ingrese nuevamente la clave."
                   v-validate="confirmationRules"
                   data-vv-as="Confirmación de clave"
                   :class="{'input': true, 'is-danger': errors.has('confirmation') }">
          </p>
          <p class="help is-danger" v-show="errors.has('confirmation')">
            {{ errors.first('confirmation') }}
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <a class="button"
           :disabled="isSubmitButtonDisabled"
           @click="onSubmit"
           :class="{'is-success': !errors.any(), 'is-danger': errors.any()}">{{ actionButton }}</a>
        <a class="button" @click="onClickClose">Cancelar</a>
      </footer>
    </div>
  </div>
</template>

<script>
  import { UserRepository } from '../../../../database/repositories/UserRepository';
  import { UserExistError } from '../../../../database/exceptions/UserExistError';
  import { ValidationError } from '../../../../database/exceptions/ValidationError';

  export default {
    props: ['user'],
    name: 'user-update-modal',
    data() {
      return {
        name: '',
        password: '',
        confirmation: '',
        email: '',
        title: '',
        actionButton: '',
        createdUser: null,
        create: null
      };
    },
    created() {
      this.setUserInComponent();
      this.userRepo = UserRepository.getInstance();
    },
    destroyed() {
      this.resetUserInComponent();
    },
    computed: {
      /**
       * Set the confirmation input rules depending on the password input state.
       */
      confirmationRules() {
        const rules = {
          confirmed: 'password',
          alpha_dash: true,
          min: 3,
          max: 16
        };

        if (this.password !== '') {
          rules.required = true;
        }

        return rules;
      },
      passwordPlaceholder() {
        return this.create ? 'Por favor ingrese la clave.' : 'Opcionalmente puede cambiar la clave.';
      },
      isSubmitButtonDisabled() {
        if (this.name === '' || this.email === '') {
          return true;
        }

        // if inputs are the same as the original user prop
        if (this.$props && this.$props.user) {
          if (this.name === this.$props.user.name && this.email === this.$props.user.email) {
            return true;
          }
        }

        return this.errors.any() || this.fields.clean();
      }
    },
    methods: {
      /**
       * Emits a closed event to the parent component.
       */
      onClickClose() {
        if (!this.hasFormChanged()) {
          return this.$emit('user-modal-closed');
        }

        if (!confirm('Hay datos no guardados, desea continuar?')) {
          return;
        }

        this.$emit('user-modal-closed');
      },

      /**
       * Checks if the form's inputs changed.
       *
       * @returns {boolean}
       */
      hasFormChanged() {
        if (this.create === true) {
          return (this.name !== '') || (this.email !== '') || (this.password !== '');
        }

        return (this.name !== this.user.name) ||
          (this.email !== this.user.email) ||
          (this.password !== '');
      },

      /**
       * Updates the component attributes according to the user object, if none,
       * the component start as create mode.
       */
      setUserInComponent() {
        if (this.user !== null && Object.keys(this.user).length > 0) {
          this.name         = this.user.name;
          this.email        = this.user.email;
          this.title        = 'Actualizar Usuario';
          this.actionButton = 'Actualizar';
          this.create       = false;

          return;
        }

        this.title        = 'Crear nuevo Usuario';
        this.actionButton = 'Crear';
        this.create       = true;
      },

      /**
       * Sets the input attributes to the defaults.
       */
      resetUserInComponent() {
        this.name         = '';
        this.email        = '';
        this.title        = '';
        this.actionButton = '';
        this.create       = null;
      },
      onSubmit() {
        if (this.create) {
          this.createNewUser();

          return;
        }

        this.updateUser();
      },
      createNewUser() {
        this.userRepo.create(this.name, this.email, this.password)
          .then(this.handleSuccess)
          .catch(this.handleError);
      },
      updateUser() {
        this.userRepo.update(this.user.id, this.name, this.email, this.password)
          .then(this.handleSuccess)
          .catch(this.handleError);
      },

      /**
       * Handles generic successful repo transaction with the database.
       *
       * @param {Object} user The new or updated user from the repo.
       */
      handleSuccess(user) {
        const word = this.create ? 'creado' : 'actualizado';
        this.$root.$emit('main-notification', `Nuevo Usuario ${word} exitosamente.`);
        this.$emit('user-modal-closed', {user, wasCreating: this.create});
      },
      handleError(err) {
        if (err instanceof UserExistError) {
          this.errors.add('name', 'El usuario ya existe.');

          return;
        } else if (err instanceof ValidationError) {
          this.errors.add('name', `Error de validación: ${err.message}`);

          return;
        } else if (err instanceof Array) {
          err.forEach(error => {
            error.each(message => this.errors.add('name',
              `Error inesperado de validación, contacte al administrador de este sistema. '${message}'`)
            );
          });

          return;
        }

        this.errors.add('name', `Error inesperado, contacte al administrador de este sistema. '${err.message}'`);

        console.error(err);
      }
    }
  };
</script>
