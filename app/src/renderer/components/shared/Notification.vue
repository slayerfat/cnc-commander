<template>
  <div class="notification" v-show="isVisible" :class="classType">
    <button class="delete" @click="onClickClose"></button>
    <span v-if="!message">
      <slot>
        Error Inesperado, por favor contacte al administrador del sistema.
      </slot>
    </span>
    <span>{{ message }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        'default': ''
      },
      duration: {
        'default': 10000,
        type: Number
      },
      open: {
        'default': true,
        type: Boolean
      }
    },
    name: 'notification',
    data() {
      return {
        timer: null,
        isOpen: null,
        message: null
      };
    },
    computed: {
      classType() {
        switch (this.type) {
          case 'info':
            return 'is-info';
          case 'primary':
            return 'is-primary';
          case 'success':
            return 'is-success';
          case 'warning':
            return 'is-warning';
          default:
            return '';
        }
      },
      isVisible() {
        return this.isOpen;
      }
    },
    methods: {
      onClickClose() {
        this.close();
      },
      close() {
        clearTimeout(this.timer);
        this.timer  = null;
        this.isOpen = false;
      }
    },
    created() {
      this.isOpen = this.open;
      this.timer  = setTimeout(() => this.close(), this.duration);

      this.$root.$on('main-notification', message => {
        if (this.timer !== null) {
          this.close();
        }

        this.message = message;
        this.isOpen  = true;
        this.timer   = setTimeout(() => this.close(), this.duration);
      });
    }
  };
</script>
