import { render } from '@testing-library/react';
import { Restaurant } from '../restaurant';
import { BrowserRouter } from 'react-router-dom';

describe('<Restaurant />', () => {
	it('renders OK with props', () => {
		const restaurantProps = {
			id: '1',
			coverImg: 'x',
			name: 'nameTest',
			categoryName: 'categoryTest',
		};

		const { getByText, container } = render(
			<BrowserRouter>
				<Restaurant
					id={restaurantProps.id}
					coverImg={restaurantProps.coverImg}
					name={restaurantProps.name}
					categoryName={restaurantProps.categoryName}
				/>
			</BrowserRouter>,
		);

		getByText(restaurantProps.name);
		getByText(restaurantProps.categoryName);
		expect(container.firstChild).toHaveAttribute('href', `/restaurant/${restaurantProps.id}`);
	});
});
