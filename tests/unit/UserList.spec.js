import { mount } from '@vue/test-utils';
import UserList from '../../src/components/UserList.vue';

describe('UserList.vue', () => {
  it('muestra correctamente la lista de clientes', () => {
    const users = [
      { id: 1, rut: '11.111.111-1', razon_social: 'Cliente Uno SpA' },
      { id: 2, rut: '22.222.222-2', razon_social: 'Cliente Dos Ltda' }
    ];

    const wrapper = mount(UserList, {
      propsData: {
        users,
        loading: false
      }
    });

    const items = wrapper.findAll('[data-cy="user-item"]');
    expect(items).toHaveLength(2);
    expect(wrapper.text()).toContain('Cliente Uno SpA - 11.111.111-1');
    expect(wrapper.text()).toContain('Cliente Dos Ltda - 22.222.222-2');
  });
});
