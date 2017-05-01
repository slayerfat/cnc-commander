<template>
  <footer class="footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>
          <strong>CNC Commander</strong> hecho por
          <a href="http://twitter.com/slayerfat">slayerfat</a>
        </p>
        <p>
          {{ date }}
        </p>
        <p>
          <a class="icon" href="https://github.com/slayerfat/cnc-commander">
            <i class="fa fa-github"></i>
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'footer-default',
    data() {
      return {
        date: new Date().getFullYear()
      };
    }
  };
</script>

<style>
  .footer {
    background: linear-gradient(whitesmoke, white);
  }
</style>
