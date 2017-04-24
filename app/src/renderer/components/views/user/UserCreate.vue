<template>
  <section class="section">
    <h1 class="title">Crear nuevo Usuario</h1>
    <div class="container">
      <div class="field">
        <label class="label">Nombre</label>
        <p class="control">
          <input type="text"
                 name="name"
                 v-model="name"
                 placeholder="Ingrese el nombre del usuario"
                 v-validate="'required|alpha_num|max:16'"
                 data-vv-as="Nombre"
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
                 placeholder="Ingrese el correo electrónico del usuario"
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
                 placeholder="Por favor ingrese la clave"
                 v-validate="'required|alpha_dash|min:3|max:16'"
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
                 placeholder="Por favor ingrese nuevamente la clave"
                 v-validate="'required|confirmed:password|alpha_dash|min:3|max:16'"
                 data-vv-as="Confirmación de clave"
                 :class="{'input': true, 'is-danger': errors.has('confirmation') }">
        </p>
        <p class="help is-danger" v-show="errors.has('confirmation')">
          {{ errors.first('confirmation') }}
        </p>
      </div>

      <div class="field is-grouped">
        <p class="help is-danger" v-show="errors.has('db_error')">
          {{ errors.first('db_error') }}
        </p>
        <p class="control">
          <button class="button"
                  :disabled="!fields.passed()"
                  @click="onSubmit"
                  :class="{'is-primary': !errors.any(), 'is-danger': errors.any()}">Crear
          </button>
        </p>
        <p class="control">
          <router-link to="/users" class="button">Cancelar</router-link>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
  import { UserRepository } from '../../../../database/repositories/UserRepository';
  import { UserExistError } from '../../../../database/exceptions/UserExistError';

  export default{
    data() {
      return {
        name: '',
        password: '',
        confirmation: '',
        email: ''
      };
    },
    methods: {
      onSubmit() {
        UserRepository.getInstance()
          .create(this.name, this.email, this.password)
          .then(() => {
            this.$root.$emit('main-notification', 'Nuevo Usuario creado exitosamente.');
            this.$router.push('/users');
          })
          .catch(err => {
            if (err instanceof UserExistError) {
              this.errors.add('name', 'El usuario ya existe.');

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
          });
      }
    }
  };
</script>
