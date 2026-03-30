<template>
  <section class="card" data-cy="user-details">
    <h2>Ficha Tributaria</h2>

    <p v-if="!user">Selecciona un cliente para ver su detalle.</p>

    <div v-else>
      <div class="client-header">
        <p><strong>RUT:</strong> {{ user.rut }}</p>
        <button type="button" data-cy="btn-toggle-edit" @click="toggleEdit">
          {{ isEditing ? 'Cancelar edición' : 'Editar datos del cliente' }}
        </button>
      </div>

      <div v-if="!isEditing">
        <p><strong>Razón Social:</strong> {{ user.razon_social }}</p>
        <p><strong>Inicio de Actividades:</strong> {{ user.inicio_actividades }}</p>
        <p><strong>Correo:</strong> {{ user.email }}</p>
        <p><strong>Teléfono:</strong> {{ user.telefono }}</p>
        <p><strong>Régimen Tributario:</strong> {{ user.regimen_tributario }}</p>
        <p><strong>DJ Obligatorias:</strong> {{ user.declaraciones_juradas }}</p>
        <p>
          <strong>Capital Propio Anual:</strong>
          ${{ Number(user.capital_propio_anual || 0).toLocaleString('es-CL') }}
        </p>
      </div>

      <form v-else class="edit-form" @submit.prevent="submitEditForm">
        <h4>Editar datos del cliente</h4>
        <div class="edit-row">
          <label>
            Razón Social
            <input v-model.trim="editForm.razon_social" data-cy="edit-razon-social" required type="text" />
          </label>
          <label>
            Inicio de Actividades
            <input v-model="editForm.inicio_actividades" data-cy="edit-inicio" required type="date" />
          </label>
          <label>
            Correo
            <input v-model.trim="editForm.email" data-cy="edit-email" required type="email" />
          </label>
          <label>
            Teléfono
            <input v-model.trim="editForm.telefono" data-cy="edit-telefono" type="text" />
          </label>
          <label>
            Régimen Tributario
            <input v-model.trim="editForm.regimen_tributario" data-cy="edit-regimen" required type="text" />
          </label>
          <label>
            Declaraciones Juradas
            <input v-model.trim="editForm.declaraciones_juradas" data-cy="edit-dj" required type="text" />
          </label>
          <label>
            Capital Propio Anual
            <input
              v-model.number="editForm.capital_propio_anual"
              data-cy="edit-capital"
              min="0"
              required
              type="number"
            />
          </label>
        </div>
        <button type="submit" data-cy="btn-save-client">Guardar cambios</button>
      </form>

      <hr />
      <h3>Historial de IVA</h3>

      <table class="iva-table">
        <thead>
          <tr>
            <th>Año</th>
            <th>Mes</th>
            <th>Monto IVA</th>
            <th>Estado</th>
            <th>Fecha Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ivaHistory" :key="`${item.year || 2026}-${item.month}`">
            <td>{{ item.year || 2026 }}</td>
            <td>{{ item.month }}</td>
            <td>${{ Number(item.amount || 0).toLocaleString('es-CL') }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.paidAt || '-' }}</td>
            <td class="actions-col">
              <button
                type="button"
                class="secondary-btn"
                data-cy="btn-edit-iva-row"
                @click="loadIvaToForm(item)"
              >
                Editar
              </button>
              <button
                type="button"
                class="danger-btn"
                data-cy="btn-delete-iva-row"
                @click="deleteIvaRow(item)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <form class="iva-form" @submit.prevent="submitIvaForm">
        <h4>Agregar / Actualizar Mes de IVA</h4>
        <div class="iva-row">
          <label>
            Año (>= 2025)
            <input
              v-model.number="ivaForm.year"
              data-cy="iva-year"
              min="2025"
              required
              type="number"
            />
          </label>
          <label>
            Mes
            <select v-model="ivaForm.month" data-cy="iva-month" required>
              <option disabled value="">Selecciona mes</option>
              <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
            </select>
          </label>
          <label>
            Monto
            <input v-model.number="ivaForm.amount" data-cy="iva-amount" min="0" required type="number" />
          </label>
          <label>
            Estado
            <select v-model="ivaForm.status" data-cy="iva-status" required>
              <option value="Pagado">Pagado</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </label>
          <label>
            Fecha pago
            <input v-model="ivaForm.paidAt" data-cy="iva-paid-at" type="date" />
          </label>
        </div>
        <button type="submit" data-cy="btn-add-iva">Guardar IVA mensual</button>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UserDetails',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isEditing: false,
      months: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ],
      editForm: {
        razon_social: '',
        inicio_actividades: '',
        email: '',
        telefono: '',
        regimen_tributario: '',
        declaraciones_juradas: '',
        capital_propio_anual: 0
      },
      ivaForm: {
        year: new Date().getFullYear(),
        month: '',
        amount: 0,
        status: 'Pagado',
        paidAt: ''
      }
    };
  },
  computed: {
    ivaHistory() {
      if (!this.user || !Array.isArray(this.user.iva_history)) {
        return [];
      }
      return this.user.iva_history;
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (!newUser) {
          this.isEditing = false;
          return;
        }

        this.editForm = {
          razon_social: newUser.razon_social || '',
          inicio_actividades: newUser.inicio_actividades || '',
          email: newUser.email || '',
          telefono: newUser.telefono || '',
          regimen_tributario: newUser.regimen_tributario || '',
          declaraciones_juradas: newUser.declaraciones_juradas || '',
          capital_propio_anual: Number(newUser.capital_propio_anual) || 0
        };
        this.isEditing = false;
      }
    }
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    submitEditForm() {
      this.$emit('update-client', {
        id: this.user.id,
        ...this.editForm
      });
      this.isEditing = false;
    },
    loadIvaToForm(item) {
      this.ivaForm = {
        year: Math.max(2025, Number(item.year) || 2026),
        month: item.month || '',
        amount: Number(item.amount) || 0,
        status: item.status || 'Pagado',
        paidAt: item.paidAt || ''
      };
    },
    deleteIvaRow(item) {
      this.$emit('remove-iva-payment', {
        year: Math.max(2025, Number(item.year) || 2026),
        month: item.month
      });
    },
    resetIvaForm() {
      this.ivaForm = {
        year: new Date().getFullYear(),
        month: '',
        amount: 0,
        status: 'Pagado',
        paidAt: ''
      };
    },
    submitIvaForm() {
      if (!this.ivaForm.month) {
        return;
      }

      this.$emit('add-iva-payment', {
        year: Math.max(2025, Number(this.ivaForm.year) || new Date().getFullYear()),
        month: this.ivaForm.month,
        amount: Number(this.ivaForm.amount) || 0,
        status: this.ivaForm.status,
        paidAt: this.ivaForm.status === 'Pagado' ? this.ivaForm.paidAt : ''
      });

      this.resetIvaForm();
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
  color: var(--ink);
}

.client-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.edit-form {
  border: 1px solid var(--panel-border);
  border-radius: 10px;
  padding: 10px;
  background: var(--accent-soft);
}

.edit-row {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.iva-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.iva-table th,
.iva-table td {
  border: 1px solid var(--panel-border);
  padding: 8px;
  font-size: 13px;
  color: var(--ink);
}

.actions-col {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
}

.iva-form {
  margin-top: 14px;
  border: 1px solid var(--panel-border);
  border-radius: 10px;
  padding: 10px;
  background: var(--accent-soft);
}

.iva-row {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

label {
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: var(--ink);
}

input,
select,
button {
  border: 1px solid var(--input-border);
  border-radius: 8px;
  padding: 8px;
}

button {
  margin-top: 10px;
  background: var(--accent);
  color: #fff;
  border: 0;
  cursor: pointer;
}

.secondary-btn {
  margin-top: 0;
  background: var(--chip-text);
  padding: 2px 6px;
  font-size: 11px;
  line-height: 1.2;
  min-height: 22px;
  white-space: nowrap;
  border-radius: 6px;
}

.danger-btn {
  margin-top: 0;
  background: var(--error);
  padding: 2px 6px;
  font-size: 11px;
  line-height: 1.2;
  min-height: 22px;
  white-space: nowrap;
  border-radius: 6px;
}

@media (max-width: 640px) {
  .iva-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .actions-col {
    min-width: 120px;
  }
}
</style>
