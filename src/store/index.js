import Vue from 'vue';
import Vuex from 'vuex';
import { createUser, getUsers, login } from '../services/api';

Vue.use(Vuex);

const STORAGE_KEY = 'jwt_token';
const CLIENTS_STORAGE_KEY = 'accounting_clients';
const DEMO_CREDENTIALS = {
  email: 'lmarialolett@gmail.com',
  password: 'Gokubonito'
};
const DEMO_TOKEN = 'demo-jwt-token-local';
const LOCAL_CLIENT_ID_PREFIX = 'cli-';

const DEFAULT_IVA_HISTORY = [
  { year: 2026, month: 'Enero', amount: 120000, status: 'Pagado', paidAt: '2026-02-12' },
  { year: 2026, month: 'Febrero', amount: 136000, status: 'Pagado', paidAt: '2026-03-12' },
  { year: 2026, month: 'Marzo', amount: 98000, status: 'Pagado', paidAt: '2026-04-12' },
  { year: 2026, month: 'Abril', amount: 0, status: 'Pendiente', paidAt: '' }
];

const LOCAL_FALLBACK_CLIENTS = [
  {
    id: `${LOCAL_CLIENT_ID_PREFIX}1`,
    rut: '12.345.678-9',
    razon_social: 'Maria Lolett Servicios Contables SpA',
    inicio_actividades: '2023-01-10',
    email: 'lmarialolett@gmail.com',
    telefono: '+56 9 5555 1212',
    regimen_tributario: 'Pro Pyme General (14 D N3)',
    declaraciones_juradas: 'DJ 1879, DJ 1887, DJ 1947',
    capital_propio_anual: 24000000,
    iva_history: DEFAULT_IVA_HISTORY
  }
];

function saveClientsToStorage(clients) {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
}

function normalizeIvaHistory(history) {
  const source = Array.isArray(history) ? history : [];
  const byKey = new Map();

  source.forEach((item) => {
    const year = Math.max(2025, Number(item.year) || 2026);
    const month = item.month || '';
    const key = `${year}-${month}`;
    byKey.set(key, {
      year,
      month,
      amount: Number(item.amount) || 0,
      status: item.status || 'Pendiente',
      paidAt: item.status === 'Pagado' ? item.paidAt || '' : ''
    });
  });

  return Array.from(byKey.values());
}

function normalizeClient(client) {
  return {
    ...client,
    iva_history: normalizeIvaHistory(client.iva_history)
  };
}

function readClientsFromStorage() {
  try {
    const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

const state = {
  clients: [],
  loadingClients: false,
  creatingClient: false,
  error: null,
  token: localStorage.getItem(STORAGE_KEY) || null
};

const getters = {
  clients: (s) => s.clients,
  loadingClients: (s) => s.loadingClients,
  creatingClient: (s) => s.creatingClient,
  error: (s) => s.error,
  isAuthenticated: (s) => Boolean(s.token)
};

const mutations = {
  SET_CLIENTS(s, clients) {
    s.clients = clients.map(normalizeClient);
  },
  ADD_CLIENT(s, client) {
    s.clients = [client, ...s.clients];
  },
  UPDATE_CLIENT(s, updatedClient) {
    s.clients = s.clients.map((client) => {
      if (String(client.id) !== String(updatedClient.id)) {
        return client;
      }
      return {
        ...client,
        ...updatedClient,
        iva_history: Array.isArray(updatedClient.iva_history)
          ? updatedClient.iva_history
          : client.iva_history
      };
    });
  },
  UPSERT_CLIENT_IVA(s, { clientId, ivaItem }) {
    const index = s.clients.findIndex((client) => String(client.id) === String(clientId));
    if (index === -1) {
      return;
    }

    const targetClient = s.clients[index];
    const currentHistory = Array.isArray(targetClient.iva_history) ? targetClient.iva_history : [];
    const targetYear = Number(ivaItem.year) || 2026;
    const foundByMonth = currentHistory.findIndex(
      (item) => item.month === ivaItem.month && Number(item.year || 2026) === targetYear
    );

    const normalizedIvaItem = {
      ...ivaItem,
      year: targetYear
    };

    let nextHistory;
    if (foundByMonth >= 0) {
      nextHistory = [...currentHistory];
      nextHistory.splice(foundByMonth, 1, normalizedIvaItem);
    } else {
      nextHistory = [...currentHistory, normalizedIvaItem];
    }

    const nextClient = {
      ...targetClient,
      iva_history: normalizeIvaHistory(nextHistory)
    };

    const nextClients = [...s.clients];
    nextClients.splice(index, 1, nextClient);
    s.clients = nextClients;
  },
  REMOVE_CLIENT_IVA(s, { clientId, year, month }) {
    const index = s.clients.findIndex((client) => String(client.id) === String(clientId));
    if (index === -1) {
      return;
    }

    const targetClient = s.clients[index];
    const currentHistory = Array.isArray(targetClient.iva_history) ? targetClient.iva_history : [];
    const nextHistory = currentHistory.filter((item) => {
      return !(Number(item.year || 2026) === Number(year) && item.month === month);
    });

    const nextClient = {
      ...targetClient,
      iva_history: nextHistory
    };

    const nextClients = [...s.clients];
    nextClients.splice(index, 1, nextClient);
    s.clients = nextClients;
  },
  SET_LOADING_CLIENTS(s, value) {
    s.loadingClients = value;
  },
  SET_CREATING_CLIENT(s, value) {
    s.creatingClient = value;
  },
  SET_ERROR(s, value) {
    s.error = value;
  },
  SET_TOKEN(s, token) {
    s.token = token;
  },
  CLEAR_TOKEN(s) {
    s.token = null;
  }
};

const actions = {
  async fetchClients({ commit }) {
    commit('SET_LOADING_CLIENTS', true);
    commit('SET_ERROR', null);
    const storedClients = readClientsFromStorage();
    if (storedClients && storedClients.length) {
      commit('SET_CLIENTS', storedClients);
      commit('SET_LOADING_CLIENTS', false);
      return;
    }

    try {
      const response = await getUsers();
      const normalized = response.data.data.map((user, idx) => ({
        id: user.id,
        rut: `${user.id}${idx}1.222.333-${(idx % 9) + 1}`,
        razon_social: `${user.first_name} ${user.last_name} Servicios EIRL`,
        inicio_actividades: '2024-01-01',
        email: user.email,
        telefono: '+56 9 0000 0000',
        regimen_tributario: 'Pro Pyme General (14 D N3)',
        declaraciones_juradas: 'DJ 1879, DJ 1887',
        capital_propio_anual: 10000000,
        iva_history: DEFAULT_IVA_HISTORY
      }));
      commit('SET_CLIENTS', normalized);
      saveClientsToStorage(normalized);
    } catch (error) {
      commit('SET_CLIENTS', LOCAL_FALLBACK_CLIENTS);
      commit('SET_ERROR', null);
      saveClientsToStorage(LOCAL_FALLBACK_CLIENTS);
    } finally {
      commit('SET_LOADING_CLIENTS', false);
    }
  },
  async addClient({ commit, state }, payload) {
    commit('SET_CREATING_CLIENT', true);
    commit('SET_ERROR', null);
    try {
      const response = await createUser(payload);
      commit('ADD_CLIENT', {
        id: response.data.id || `${LOCAL_CLIENT_ID_PREFIX}${Date.now()}`,
        rut: payload.rut,
        razon_social: payload.razon_social,
        inicio_actividades: payload.inicio_actividades,
        email: payload.email,
        telefono: payload.telefono,
        regimen_tributario: payload.regimen_tributario,
        declaraciones_juradas: payload.declaraciones_juradas,
        capital_propio_anual: Number(payload.capital_propio_anual) || 0,
        iva_history: DEFAULT_IVA_HISTORY
      });
      saveClientsToStorage(state.clients);
    } catch (error) {
      commit('ADD_CLIENT', {
        id: `${LOCAL_CLIENT_ID_PREFIX}${Date.now()}`,
        rut: payload.rut,
        razon_social: payload.razon_social,
        inicio_actividades: payload.inicio_actividades,
        email: payload.email,
        telefono: payload.telefono,
        regimen_tributario: payload.regimen_tributario,
        declaraciones_juradas: payload.declaraciones_juradas,
        capital_propio_anual: Number(payload.capital_propio_anual) || 0,
        iva_history: DEFAULT_IVA_HISTORY
      });
      saveClientsToStorage(state.clients);
    } finally {
      commit('SET_CREATING_CLIENT', false);
    }
  },
  addIvaPayment({ commit, state }, payload) {
    commit('SET_ERROR', null);
    commit('UPSERT_CLIENT_IVA', payload);
    saveClientsToStorage(state.clients);
  },
  updateClient({ commit, state }, payload) {
    commit('UPDATE_CLIENT', payload);
    saveClientsToStorage(state.clients);
  },
  removeIvaPayment({ commit, state }, payload) {
    commit('REMOVE_CLIENT_IVA', payload);
    saveClientsToStorage(state.clients);
  },
  async login({ commit }, credentials) {
    commit('SET_ERROR', null);
    try {
      const response = await login(credentials);
      const token = response.data.token;
      localStorage.setItem(STORAGE_KEY, token);
      commit('SET_TOKEN', token);
      return token;
    } catch (error) {
      const isDemoUser =
        credentials.email === DEMO_CREDENTIALS.email &&
        credentials.password === DEMO_CREDENTIALS.password;

      if (isDemoUser) {
        localStorage.setItem(STORAGE_KEY, DEMO_TOKEN);
        commit('SET_TOKEN', DEMO_TOKEN);
        return DEMO_TOKEN;
      }

      commit('SET_ERROR', 'Credenciales inválidas.');
      throw error;
    }
  },
  logout({ commit }) {
    localStorage.removeItem(STORAGE_KEY);
    commit('CLEAR_TOKEN');
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
