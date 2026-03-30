<template>
  <section class="panel">
    <header class="header-row">
      <h1 data-cy="title-users">Gestión de Clientes Contables</h1>
      <button data-cy="btn-logout" @click="logout">Cerrar sesión</button>
    </header>

    <p v-if="error" class="error">{{ error }}</p>

    <UserForm @submit-client="onSubmitClient" />

    <div class="content-grid">
      <UserList
        :users="clients"
        :selected-user-id="selectedClientId"
        :loading="loadingClients"
        @select-user="onSelectClient"
      >
        <template #user="{ user }">
          <span>{{ user.razon_social }} - {{ user.rut }}</span>
        </template>
      </UserList>

      <UserDetails
        :user="selectedClient"
        @add-iva-payment="onAddIvaPayment"
        @update-client="onUpdateClient"
        @remove-iva-payment="onRemoveIvaPayment"
      />
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import UserDetails from '../components/UserDetails.vue';
import UserForm from '../components/UserForm.vue';
import UserList from '../components/UserList.vue';

export default {
  name: 'UsersView',
  components: {
    UserForm,
    UserList,
    UserDetails
  },
  data() {
    return {
      selectedClientId: null
    };
  },
  computed: {
    ...mapGetters(['clients', 'loadingClients', 'error']),
    selectedClient() {
      return this.clients.find((client) => String(client.id) === String(this.selectedClientId)) || null;
    }
  },
  watch: {
    clients: {
      immediate: true,
      handler(newClients) {
        if (!newClients.length) {
          this.selectedClientId = null;
          return;
        }

        const selectedStillExists = newClients.some(
          (client) => String(client.id) === String(this.selectedClientId)
        );

        if (!selectedStillExists) {
          this.selectedClientId = newClients[0].id;
        }
      }
    }
  },
  async created() {
    await this.$store.dispatch('fetchClients');
  },
  methods: {
    async onSubmitClient(payload) {
      await this.$store.dispatch('addClient', payload);
    },
    onSelectClient(client) {
      this.selectedClientId = client.id;
    },
    onAddIvaPayment(payload) {
      this.$store.dispatch('addIvaPayment', {
        clientId: this.selectedClientId,
        ivaItem: payload
      });
    },
    onRemoveIvaPayment(payload) {
      this.$store.dispatch('removeIvaPayment', {
        clientId: this.selectedClientId,
        ...payload
      });
    },
    onUpdateClient(payload) {
      this.$store.dispatch('updateClient', payload);
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

button {
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: 8px 12px;
  background: var(--chip-bg);
  color: var(--chip-text);
  cursor: pointer;
}

.content-grid {
  margin-top: 20px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.error {
  color: var(--error);
  margin-bottom: 12px;
  font-weight: 600;
}
</style>
