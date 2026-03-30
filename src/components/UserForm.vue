<template>
  <form class="user-form" @submit.prevent="submitForm">
    <h2>Registrar Cliente</h2>
    <div class="row">
      <label>
        RUT
        <input v-model.trim="rut" data-cy="input-rut" type="text" placeholder="12.345.678-9" required />
      </label>
      <label>
        Razón Social
        <input
          v-model.trim="razon_social"
          data-cy="input-razon-social"
          type="text"
          placeholder="Mi Empresa SpA"
          required
        />
      </label>
      <label>
        Inicio de Actividades
        <input
          v-model="inicio_actividades"
          data-cy="input-inicio-actividades"
          type="date"
          required
        />
      </label>
      <label>
        Correo
        <input
          v-model.trim="email"
          data-cy="input-user-email"
          type="email"
          placeholder="cliente@email.com"
          required
        />
      </label>
      <label>
        Teléfono
        <input v-model.trim="telefono" data-cy="input-telefono" type="text" placeholder="+56 9 0000 0000" />
      </label>
      <label>
        Régimen Tributario
        <input
          v-model.trim="regimen_tributario"
          data-cy="input-regimen"
          type="text"
          placeholder="Pro Pyme General (14 D N3)"
          required
        />
      </label>
      <label>
        Declaraciones Juradas
        <input
          v-model.trim="declaraciones_juradas"
          data-cy="input-dj"
          type="text"
          placeholder="DJ 1879, DJ 1887"
          required
        />
      </label>
      <label>
        Capital Propio Anual
        <input
          v-model.number="capital_propio_anual"
          data-cy="input-capital"
          type="number"
          min="0"
          placeholder="12000000"
          required
        />
      </label>
    </div>
    <button data-cy="btn-add-user" type="submit">Agregar cliente</button>
  </form>
</template>

<script>
export default {
  name: 'UserForm',
  data() {
    return {
      rut: '',
      razon_social: '',
      inicio_actividades: '',
      email: '',
      telefono: '',
      regimen_tributario: '',
      declaraciones_juradas: '',
      capital_propio_anual: null
    };
  },
  methods: {
    resetForm() {
      this.rut = '';
      this.razon_social = '';
      this.inicio_actividades = '';
      this.email = '';
      this.telefono = '';
      this.regimen_tributario = '';
      this.declaraciones_juradas = '';
      this.capital_propio_anual = null;
    },
    submitForm() {
      const payload = {
        rut: this.rut,
        razon_social: this.razon_social,
        inicio_actividades: this.inicio_actividades,
        email: this.email,
        telefono: this.telefono,
        regimen_tributario: this.regimen_tributario,
        declaraciones_juradas: this.declaraciones_juradas,
        capital_propio_anual: this.capital_propio_anual
      };

      this.$emit('submit-client', payload);
      this.resetForm();
    }
  }
};
</script>

<style scoped>
.user-form {
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 14px;
  background: var(--accent-soft);
}

.row {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
}

label {
  display: grid;
  gap: 4px;
  font-size: 14px;
  color: var(--ink);
}

input,
button,
select {
  padding: 9px;
  border-radius: 8px;
  border: 1px solid var(--input-border);
}

button {
  margin-top: 12px;
  background: var(--accent);
  color: #fff;
  border: 0;
  cursor: pointer;
}
</style>
