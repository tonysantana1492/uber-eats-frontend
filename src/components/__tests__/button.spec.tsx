import { render } from '@testing-library/react';
import { Button } from '../button';

describe('< Button />', () => {
	it('should render OK with props', () => {
		const { getByText } = render(<Button canClick={true} actionText='test' loading={false} />);

		getByText('test');

	});

	it('should should display loading OK with props', () => {
		const { getByText, container } = render(<Button canClick={false} actionText='test' loading={true} />);

		getByText('Loading...');
        expect(container.firstChild).toHaveClass('pointer-events-none');
	});
});
