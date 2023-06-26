import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { graphql } from '../gql';
import { useMutation, useQuery } from '@apollo/client';
import { useMe } from '../hooks/useMe';
import { OrderStatus, UserRole } from '../gql/graphql';

type IParams = {
	id: string;
};

const GET_ORDER = graphql(`
	query getOrder($input: GetOrderInput!) {
		getOrder(input: $input) {
			error
			ok
			order {
				...FullOrderParts
			}
		}
	}
`);

const EDIT_ORDER = graphql(`
	mutation editOrder($input: EditOrderInput!) {
		editOrder(input: $input) {
			ok
			error
		}
	}
`);

export const Order = () => {
	const { id } = useParams<IParams>();
	const { data: userData } = useMe();

	const [editOrderMutation] = useMutation(EDIT_ORDER, {
		refetchQueries: [
			{
				query: GET_ORDER,
				variables: {
					input: {
						orderId: +(id as string),
					},
				},
			},
		],
	});

	const { data } = useQuery(GET_ORDER, {
		variables: {
			input: {
				orderId: +(id as string),
			},
		},
	});

	const onButtonClick = (newStatus: OrderStatus) => {
		editOrderMutation({
			variables: {
				input: {
					id: +(id as string),
					status: newStatus,
				},
			},
		});
	};

	return (
		<div className='mt-20 container flex justify-center'>
			<Helmet>
				<title>Order #{id} | Uber Eats</title>
			</Helmet>
			<div className='border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center'>
				<h4 className='bg-gray-800 w-full py-5 text-white text-center text-xl'>Order #{id}</h4>
				<h5 className='p-5 pt-10 text-3xl text-center '>${data?.getOrder.order?.total}</h5>
				<div className='p-5 text-xl grid gap-6'>
					<div className='border-t pt-5 border-gray-700'>
						Prepared By: <span className='font-medium'>{data?.getOrder.order?.restaurant?.name}</span>
					</div>
					<div className='border-t pt-5 border-gray-700 '>
						Deliver To: <span className='font-medium'>{data?.getOrder.order?.customer?.email}</span>
					</div>
					<div className='border-t border-b py-5 border-gray-700'>
						Driver: <span className='font-medium'>{data?.getOrder.order?.driver?.email || 'Not yet.'}</span>
					</div>
					{userData?.me.role === 'Client' && (
						<span className=' text-center mt-5 mb-3  text-2xl text-lime-600'>
							Status: {data?.getOrder.order?.status}
						</span>
					)}
					{userData?.me.role === UserRole.Owner && (
						<>
							{data?.getOrder.order?.status === OrderStatus.Pending && (
								<button onClick={() => onButtonClick(OrderStatus.Cooking)} className='btn'>
									Accept Order
								</button>
							)}
							{data?.getOrder.order?.status === OrderStatus.Cooking && (
								<button onClick={() => onButtonClick(OrderStatus.Cooked)} className='btn'>
									Order Cooked
								</button>
							)}
							{data?.getOrder.order?.status !== OrderStatus.Cooking &&
								data?.getOrder.order?.status !== OrderStatus.Pending && (
									<span className=' text-center mt-5 mb-3  text-2xl text-lime-600'>
										Status: {data?.getOrder.order?.status}
									</span>
								)}
						</>
					)}
					{userData?.me.role === UserRole.Delivery && (
						<>
							{data?.getOrder.order?.status === OrderStatus.Cooked && (
								<button onClick={() => onButtonClick(OrderStatus.PickedUp)} className='btn'>
									Picked Up
								</button>
							)}
							{data?.getOrder.order?.status === OrderStatus.PickedUp && (
								<button onClick={() => onButtonClick(OrderStatus.Delivered)} className='btn'>
									Order Delivered
								</button>
							)}
						</>
					)}
					{data?.getOrder.order?.status === OrderStatus.Delivered && (
						<span className=' text-center mt-5 mb-3  text-2xl text-lime-600'>
							Thank you for using Uber Eats
						</span>
					)}
				</div>
			</div>
		</div>
	);
};
