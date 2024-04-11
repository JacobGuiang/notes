import { faker } from '@faker-js/faker';

describe('Auth', () => {
  describe('Register', () => {
    beforeEach(() => {
      cy.visit('/auth/register');
    });

    it('should register user if data is ok', () => {
      cy.get('input[name=username]').type(faker.string.alphanumeric(8));
      cy.get('input[name=password]').type(`Password1!{enter}`);

      cy.url().should('include', '/users/me/notes');
      cy.getCookie('token').should('exist');
    });

    it('should not register user if username is invalid', () => {
      cy.get('input[name=username]').type('invalid user name');
      cy.get('input[name=password]').type(`Password1!{enter}`);

      cy.url().should('include', '/auth/register');
      cy.getCookie('token').should('not.exist');
    });

    it('should not register user if username is already used', () => {
      const newUser = {
        username: faker.string.alphanumeric(8),
        password: 'Password1!',
      };
      cy.request('POST', 'http://localhost:8080/auth/register', newUser);

      cy.get('input[name=username]').type(newUser.username);
      cy.get('input[name=password]').type(`${newUser.password}{enter}`);

      cy.url().should('include', '/auth/register');
      cy.getCookie('token').should('not.exist');
    });

    it('should not register user if password length is less than 8 characters', () => {
      cy.get('input[name=username]').type(faker.string.alphanumeric(8));
      cy.get('input[name=password]').type(`Passw1!{enter}`);

      cy.url().should('include', '/auth/register');
      cy.getCookie('token').should('not.exist');
    });

    it('should not register user if password does not have lower and uppercase letter, number, and symbol', () => {
      cy.get('input[name=username]').type(faker.string.alphanumeric(8));
      cy.get('input[name=password]').type(`password{enter}`);
      cy.get('input[name=password]').type(`1111111{enter}`);

      cy.url().should('include', '/auth/register');
      cy.getCookie('token').should('not.exist');
    });
  });

  describe('Log In', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should log in user if username and password match', () => {
      const newUser = {
        username: faker.string.alphanumeric(8),
        password: 'Password1!',
      };
      cy.request('POST', 'http://localhost:8080/auth/register', newUser);

      cy.get('input[name=username]').type(newUser.username);
      cy.get('input[name=password]').type(`${newUser.password}{enter}`);

      cy.url().should('include', '/users/me/notes');
      cy.getCookie('token').should('exist');
    });

    it('should not log in user if there are no users with that username', () => {
      cy.get('input[name=username]').type(faker.string.alphanumeric(8));
      cy.get('input[name=password]').type(`Password1!{enter}`);

      cy.url().should('not.include', '/users/me/notes');
      cy.getCookie('token').should('not.exist');
    });

    it('should not log in user if password is wrong', () => {
      const newUser = {
        username: faker.string.alphanumeric(8),
        password: 'Password1!',
      };
      cy.request('POST', 'http://localhost:8080/auth/register', newUser);

      cy.get('input[name=username]').type(newUser.username);
      cy.get('input[name=password]').type(`wrongPassword1!{enter}`);

      cy.url().should('not.include', '/users/me/notes');
      cy.getCookie('token').should('not.exist');
    });
  });

  describe('Log Out', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should log out user', () => {
      const newUser = {
        username: faker.string.alphanumeric(8),
        password: 'Password1!',
      };
      cy.request('POST', 'http://localhost:8080/auth/register', newUser);

      // register
      cy.get('input[name=username]').type(newUser.username);
      cy.get('input[name=password]').type(`${newUser.password}{enter}`);

      // log out
      cy.get('header > svg').click();
      cy.contains('Sign out').click();

      cy.url().should('not.include', '/users/me/notes');
      cy.getCookie('token').should('not.exist');
    });
  });
});
