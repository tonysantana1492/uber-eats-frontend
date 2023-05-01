import { Helmet } from 'react-helmet-async';
import { graphql } from '../../gql';
import { useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';

const CREATE_RESTAURANT_MUTATION = graphql(`
	mutation createRestaurant($input: CreateRestaurantInput!) {
		createRestaurant(input: $input) {
			ok
			error
		}
	}
`);

interface IFormProp {
	name: 'string';
	address: 'string';
	categoryName: 'string';
	coverImg: 'string';
}

export const AddRestaurant = () => {
	const [createRestaurantMutation, { data, loading }] = useMutation(CREATE_RESTAURANT_MUTATION);

	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm<IFormProp>({
		mode: 'onChange',
	});

	const onSubmit: SubmitHandler<IFormProp> = data => {
		console.log(data);
		createRestaurantMutation({
			variables: {
				input: {
					name: data.name,
					address: data.address,
					categoryName: data.categoryName,
					coverImg: '',
				},
			},
		});
	};

	return (
		<div className='container flex flex-col items-center mt-36'>
			<Helmet>
				<title>Add Restaurant | Uber Eats</title>
			</Helmet>
			<h4 className='font-semibold text-2xl mb-3'>Add Restaurant</h4>
			<form className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5' noValidate onSubmit={handleSubmit(onSubmit)}>
				<input
					type='text'
					className='input'
					placeholder='Name'
					{...register('name', {
						required: 'Name is required',
					})}
				/>
				<input
					type='text'
					className='input'
					placeholder='Address'
					{...register('address', {
						required: 'Address is required',
					})}
				/>
				<input
					type='text'
					className='input'
					placeholder='Category Name'
					{...register('categoryName', {
						required: 'Category Name is required',
					})}
				/>

				<input
					type='file'
					accept='image/*'
					{...register('coverImg', {
						required: true,
					})}
				/>
				<Button actionText='Create Restaurant' canClick={isValid} loading={loading} />
				{data?.createRestaurant?.error && <FormError errorMessage={data.createRestaurant.error} />}
			</form>
		</div>
	);
};
