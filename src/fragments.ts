import { graphql } from './gql';

// Este fragment es de tipo restaurant
// Un fragment es una parte de un type
export const RESTAURANT_FRAGMENT = graphql(`
	fragment RestaurantParts on Restaurant {
		id
		name
		coverImg
		category {
			name
		}
		address
		isPromoted
	}
`);

export const CATEGORY_FRAGMENT = graphql(`
	fragment CategoryParts on Category {
		id
		name
		coverImg
		slug
		restaurantCount
	}
`);
