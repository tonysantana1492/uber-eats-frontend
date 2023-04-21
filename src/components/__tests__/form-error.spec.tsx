import { FormError } from '../form-error';
import { render } from '@testing-library/react';

describe('<FormError />', () => {
	it('renders OK with props', () => {
		const { getByText } = render(<FormError errorMessage='test' />);

		getByText('test');
	});
});
