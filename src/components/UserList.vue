<template>
  <section class="card">
    <h2>Cartera de Clientes</h2>

    <p v-if="loading" data-cy="loading-users">Cargando clientes...</p>
    <p v-else-if="!users.length" data-cy="empty-users">No hay clientes.</p>

    <ul v-else data-cy="users-list">
      <li
        v-for="user in users"
        :key="user.id"
        :class="{ active: String(user.id) === String(selectedUserId) }"
      >
        <button
          type="button"
          class="item"
          data-cy="user-item"
          @click="$emit('select-user', user)"
        >
          <slot name="user" :user="user">
            {{ user.razon_social }} - {{ user.rut }}
          </slot>
        </button>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'UserList',
  props: {
    users: {
      type: Array,
      required: true
    },
    selectedUserId: {
      type: [String, Number],
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.card {
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 14px;
  background: var(--panel);
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.item {
  width: 100%;
  text-align: left;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--input-border);
  background: rgba(255, 255, 255, 0.68);
  color: var(--ink);
  cursor: pointer;
}

.active .item {
  border-color: var(--accent);
  background: var(--accent-soft);
}
</style>
