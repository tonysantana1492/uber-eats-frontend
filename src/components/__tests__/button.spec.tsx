import { render } from '../../utils/test-utils';
import { Button } from '../button';

describe('< Button />', () => {
	it('should render OK with props', () => {
		const { getByText } = render(<Button canClick={true} actionText='test' loading={false} />);

		expect(getByText('test')).toBeInTheDocument();
	});

	it('should should display loading OK with props', () => {
		const { getByText, container } = render(<Button canClick={false} actionText='test' loading={true} />);

		expect(getByText('Loading...')).toBeInTheDocument();
		expect(container.firstChild).toHaveClass('pointer-events-none');
	});
});
