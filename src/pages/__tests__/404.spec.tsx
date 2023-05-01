import { render, waitFor } from '../../utils/test-utils';
import { NotFound } from '../404';

describe('<NotFound />', () => {
	it('renders OK', async () => {
		const { getByText } = render(<NotFound />);

		await waitFor(() => {
			expect(document.title).toBe('Not Found | Uber Eats');
		});
		
		expect(getByText('Page Not Found.')).toBeInTheDocument();
	});
});
