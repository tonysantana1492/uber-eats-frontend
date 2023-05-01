import { render } from '../../utils/test-utils';
import { Restaurant } from '../restaurant';

describe('<Restaurant />', () => {
	it('renders OK with props', () => {
		const restaurantProps = {
			id: '1',
			coverImg: 'x',
			name: 'nameTest',
			categoryName: 'categoryTest',
		};

		const { getByText, container } = render(
			
				<Restaurant
					id={restaurantProps.id}
					coverImg={restaurantProps.coverImg}
					name={restaurantProps.name}
					categoryName={restaurantProps.categoryName}
				/>
		);

		expect(getByText(restaurantProps.name)).toBeInTheDocument();
		expect(getByText(restaurantProps.categoryName)).toBeInTheDocument();
		expect(container.firstChild).toHaveAttribute('href', `/restaurant/${restaurantProps.id}`);
	});
});
