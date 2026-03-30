describe('Flujo principal de la aplicación', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://reqres.in/api/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('login');

    cy.intercept('GET', 'https://reqres.in/api/users?page=1', {
      statusCode: 200,
      body: {
        data: [
          {
            id: 1,
            email: 'janet.weaver@reqres.in',
            first_name: 'Janet',
            last_name: 'Weaver',
            avatar: 'https://reqres.in/img/faces/2-image.jpg'
          }
        ]
      }
    }).as('getUsers');

    cy.intercept('POST', 'https://reqres.in/api/users', {
      statusCode: 201,
      body: { id: '999', createdAt: '2026-03-29T00:00:00.000Z' }
    }).as('createUser');

    cy.visit('/login');
  });

  it('permite iniciar sesión y acceder a la aplicación', () => {
    cy.get('[data-cy="input-email"]').clear().type('lmarialolett@gmail.com');
    cy.get('[data-cy="input-password"]').clear().type('Gokubonito');
    cy.get('[data-cy="btn-login"]').click();

    cy.wait('@login');
    cy.wait('@getUsers');

    cy.url().should('include', '/users');
    cy.get('[data-cy="title-users"]').should('be.visible');
  });

  it('permite agregar un cliente y verlo en la lista', () => {
    cy.get('[data-cy="btn-login"]').click();
    cy.wait('@getUsers');

    cy.get('[data-cy="input-rut"]').type('77.777.777-7');
    cy.get('[data-cy="input-razon-social"]').type('Cabanas CJDMXMX');
    cy.get('[data-cy="input-inicio-actividades"]').type('2025-01-15');
    cy.get('[data-cy="input-user-email"]').type('cabanas@correo.com');
    cy.get('[data-cy="input-telefono"]').type('+56 9 8888 7777');
    cy.get('[data-cy="input-regimen"]').type('Pro Pyme General (14 D N3)');
    cy.get('[data-cy="input-dj"]').type('DJ 1879, DJ 1887');
    cy.get('[data-cy="input-capital"]').type('19000000');
    cy.get('[data-cy="btn-add-user"]').click();

    cy.wait('@createUser');

    cy.get('[data-cy="users-list"]').should('contain.text', 'Cabanas CJDMXMX - 77.777.777-7');
  });
});
