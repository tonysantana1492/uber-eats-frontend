import { FC, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { graphql } from '../../gql';
import { useMutation, useQuery } from '@apollo/client';
import { Dish } from '../../components/dish';
import { DishOption } from '../../components/dish-option';
import { CreateOrderItemInput, CreateOrderMutation } from '../../gql/graphql';

type IRestaurantParams = {
	id: string;
};

const RESTAURANT_QUERY = graphql(`
	query restaurant($input: RestaurantInput!) {
		restaurant(input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
				menu {
					...DishParts
				}
			}
		}
	}
`);

const CREATE_ORDER_MUTATION = graphql(`
	mutation createOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			ok
			error
			orderId
		}
	}
`);

export const Restaurant: FC = () => {
	const params = useParams<IRestaurantParams>();
	const navigate = useNavigate();
	const [orderStarted, setOrderStarted] = useState(false);
	const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

	const { data } = useQuery(RESTAURANT_QUERY, {
		variables: {
			input: {
				restaurantId: Number(params.id),
			},
		},
	});

	const onCompleted = (data: CreateOrderMutation) => {
		if (data.createOrder.ok) {
			navigate(`/orders/${data.createOrder.orderId}`, { replace: true });
		}
	};

	const [createOrderMutation, { loading: placingOrder }] = useMutation(CREATE_ORDER_MUTATION, { onCompleted });

	const getItem = (dishId: number) => {
		return orderItems.find(order => order.dishId === dishId);
	};

	const isSelected = (dishId: number) => {
		return Boolean(getItem(dishId));
	};

	const addItemToOrder = (dishId: number) => {
		if (isSelected(dishId)) return;
		setOrderItems(current => [{ dishId }, ...current]);
	};

	const removeFromOrder = (dishId: number) => {
		setOrderItems(current => current.filter(dish => dish.dishId !== dishId));
	};

	const addOptionToItem = (dishId: number, optionName: string) => {
		if (!isSelected(dishId)) return;
		const oldItem = getItem(dishId);

		if (oldItem) {
			const hasOption = Boolean(oldItem.options?.find(aOption => aOption.name == optionName));
			if (!hasOption) {
				removeFromOrder(dishId);
				setOrderItems(current => [
					{ dishId, options: [{ name: optionName }, ...(oldItem.options ?? [])] },
					...current,
				]);
			}
		}
	};

	const removeOptionFromItem = (dishId: number, optionName: string) => {
		if (!isSelected(dishId)) return;
		const oldItem = getItem(dishId);

		if (oldItem) {
			removeFromOrder(dishId);
			setOrderItems(current => [
				{
					dishId,
					options: oldItem.options?.filter(option => option.name !== optionName),
				},
				...current,
			]);

			return;
		}
	};

	const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
		return item.options?.find(option => option.name === optionName);
	};

	const isOptionSelected = (dishId: number, optionName: string) => {
		const item = getItem(dishId);

		if (item) {
			return Boolean(getOptionFromItem(item, optionName));
		}

		return false;
	};

	const triggerStartOrder = () => {
		setOrderStarted(true);
	};

	const triggerCancelOrder = () => {
		setOrderStarted(false);
		setOrderItems([]);
	};

	const triggerConfirmOrder = () => {
		if (placingOrder) return;

		if (orderItems.length === 0) {
			alert("Can't place empty order");
			return;
		}

		const ok = window.confirm('You are about to place an order');
		if (ok)  {
			createOrderMutation({
				variables: {
					input: {
						restaurantId: +(params.id as string),
						items: orderItems,
					},
				},
			});
		}
	};

	return (
		<div>
			<Helmet>
				<title>{data?.restaurant.restaurant?.name || ''} | Uber Eats</title>
			</Helmet>
			<div
				className=' bg-gray-800 bg-center bg-cover py-48'
				style={{
					backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
				}}
			>
				<div className='bg-white xl:w-3/12 py-8 pl-16'>
					<h4 className='text-4xl mb-3'>{data?.restaurant.restaurant?.name}</h4>
					<h5 className='text-sm font-light mb-2'>{data?.restaurant.restaurant?.category?.name}</h5>
					<h6 className='text-sm font-light'>{data?.restaurant.restaurant?.address}</h6>
				</div>
			</div>
			<div className='container pb-32 flex flex-col items-end mt-6'>
				{!orderStarted && (
					<button onClick={triggerStartOrder} className='btn px-10'>
						Start Order
					</button>
				)}
				{orderStarted && (
					<div className='flex items-center'>
						<button onClick={triggerConfirmOrder} className='btn px-10 mr-3'>
							Confirm Order
						</button>
						<button onClick={triggerCancelOrder} className='btn px-10 bg-black hover:bg-black'>
							Cancel Order
						</button>
					</div>
				)}

				<div className='w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10'>
					{!data?.restaurant.restaurant?.menu ? (
						<div>Dishes not found</div>
					) : (
						data?.restaurant.restaurant?.menu.map((dish, index) => (
							<Dish
								isSelected={isSelected(dish.id)}
								id={dish.id}
								orderStarted={orderStarted}
								key={index}
								name={dish.name}
								description={dish.description}
								price={dish.price}
								isCustomer={true}
								options={dish.options}
								addItemToOrder={addItemToOrder}
								removeFromOrder={removeFromOrder}
							>
								{dish.options?.map((option, index) => (
									<DishOption
										key={index}
										dishId={dish.id}
										isSelected={isOptionSelected(dish.id, option.name)}
										name={option.name}
										extra={option.extra}
										addOptionToItem={addOptionToItem}
										removeOptionFromItem={removeOptionFromItem}
									/>
								))}
							</Dish>
						))
					)}
				</div>
			</div>
		</div>
	);
};
