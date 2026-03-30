<template>
  <section class="panel">
    <h1 data-cy="title-login">Iniciar sesión</h1>
    <p>Autenticación simulada con JWT (ReqRes API).</p>

    <form class="login-form" @submit.prevent="handleLogin">
      <label>
        Email
        <input
          v-model="email"
          data-cy="input-email"
          type="email"
          required
          placeholder="lmarialolett@gmail.com"
        />
      </label>
      <label>
        Password
        <input
          v-model="password"
          data-cy="input-password"
          type="password"
          required
          placeholder="Gokubonito"
        />
      </label>
      <button data-cy="btn-login" type="submit">Ingresar</button>
    </form>

    <p v-if="error" data-cy="login-error" class="error">{{ error }}</p>

    <small class="hint">
      Credenciales de prueba: <strong>lmarialolett@gmail.com</strong> / <strong>Gokubonito</strong>
    </small>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LoginView',
  data() {
    return {
      email: 'lmarialolett@gmail.com',
      password: 'Gokubonito'
    };
  },
  computed: {
    ...mapGetters(['error'])
  },
  methods: {
    async handleLogin() {
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        });
        this.$router.push('/users');
      } catch (error) {
        // Error controlled in Vuex.
      }
    }
  }
};
</script>

<style scoped>
.login-form {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input,
button {
  padding: 10px;
  border: 1px solid var(--input-border);
  border-radius: 8px;
}

button {
  cursor: pointer;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}

.error {
  margin-top: 12px;
  color: var(--error);
  font-weight: 600;
}

.hint {
  display: block;
  margin-top: 10px;
  color: var(--muted);
}
</style>
