import { FormError } from '../form-error';
import { render } from '../../utils/test-utils';

describe('<FormError />', () => {
	it('renders OK with props', () => {
		const { getByText } = render(<FormError errorMessage='test' />);

		expect(getByText('test')).toBeInTheDocument();
	});
});
