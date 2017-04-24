<template>
  <div class="notification" v-show="open" :class="classType">
    <button class="delete" @click="onClickClose"></button>
    <slot>
      Error Inesperado, por favor contacte al administrador del sistema.
    </slot>
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
      }
    },
    name: 'notification',
    data() {
      return {
        open: true,
        timer: null
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
      }
    },
    methods: {
      onClickClose() {
        this.open = false;
      },
      close() {
        clearTimeout(this.timer);
        this.open = false;
      }
    },
    created() {
      this.timer = setTimeout(() => this.close(), this.duration);
    }
  };
</script>
