import { graphql } from './gql';

// Este fragment es de tipo restaurant
// Un fragment es una parte de un type el cual puedo ver en el schema del server
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

export const DISH_FRAGMENT = graphql(`
	fragment DishParts on Dish {
		id
		name
		price
		photo
		description
		options {
			name
			extra
			choices {
				name
				extra
			}
		}
	}
`);

export const ORDERS_FRAGMENT = graphql(`
	fragment OrderParts on Order {
		id
		createdAt
		total
	}
`);

export const FULL_ORDER_FRAGMENT = graphql(`
	fragment FullOrderParts on Order {
		id
		status
		total
		driver {
			email
		}
		customer {
			email
		}
		restaurant {
			name
		}
	}
`);
