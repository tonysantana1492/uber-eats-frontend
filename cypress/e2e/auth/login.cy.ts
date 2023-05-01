describe('Login Page', () => {
	it('should see login page', () => {
		cy.visit('/').title().should('eq', 'Login | Uber Eats');
	});

	it('can see email/password validation errors', () => {
		cy.visit('/');

		cy.findByPlaceholderText(/email/i).type('bad-email');
		cy.findByRole('alert').should('have.text', 'Please enter a valid email');

		cy.findByPlaceholderText(/email/i).clear();
		cy.findByRole('alert').should('have.text', 'Email is required');

		cy.findByPlaceholderText(/email/i).type('test@gmail.com');
		cy.findByPlaceholderText(/password/i)
			.type('123')
			.clear();
		cy.findByRole('alert').should('have.text', 'Password is required');
	});

	it('can fill out the form and log in', () => {
		cy.login('client@gmail.com', '123456');
	});
});
