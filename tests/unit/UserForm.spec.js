import { mount } from '@vue/test-utils';
import UserForm from '../../src/components/UserForm.vue';

describe('UserForm.vue', () => {
  it('emite correctamente los datos del cliente', async () => {
    const wrapper = mount(UserForm);

    await wrapper.find('[data-cy="input-rut"]').setValue('11.111.111-1');
    await wrapper.find('[data-cy="input-razon-social"]').setValue('Cliente Uno SpA');
    await wrapper.find('[data-cy="input-inicio-actividades"]').setValue('2024-01-15');
    await wrapper.find('[data-cy="input-user-email"]').setValue('cliente@uno.com');
    await wrapper.find('[data-cy="input-telefono"]').setValue('+56 9 7777 0000');
    await wrapper.find('[data-cy="input-regimen"]').setValue('Pro Pyme General');
    await wrapper.find('[data-cy="input-dj"]').setValue('DJ 1879');
    await wrapper.find('[data-cy="input-capital"]').setValue('15000000');

    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.emitted('submit-client')).toBeTruthy();
    expect(wrapper.emitted('submit-client')[0][0]).toEqual({
      rut: '11.111.111-1',
      razon_social: 'Cliente Uno SpA',
      inicio_actividades: '2024-01-15',
      email: 'cliente@uno.com',
      telefono: '+56 9 7777 0000',
      regimen_tributario: 'Pro Pyme General',
      declaraciones_juradas: 'DJ 1879',
      capital_propio_anual: 15000000
    });
  });
});
