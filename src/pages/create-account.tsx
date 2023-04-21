import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@apollo/client';

import nuberLogo from '../images/logo.svg';
import { FormError } from '../components/form-error';
import { Button } from '../components/button';
import { graphql } from '../gql';
import { CreateAccountMutation, UserRole } from '../gql/graphql';

type IFormData = {
	email: string;
	password: string;
	role: UserRole;
};

const CREATE_ACCOUNT_MUTATION = graphql(`
	mutation createAccount($createAccountInput: CreateAccountInput!) {
		createAccount(input: $createAccountInput) {
			ok
			error
		}
	}
`);

export const CreateAccount = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<IFormData>({
		defaultValues: {
			role: UserRole.Client,
		},
	});

	const navigate = useNavigate();

	const onCompleted = (data: CreateAccountMutation) => {
		const {
			createAccount: { ok },
		} = data;
		if (ok) {
			alert('Account Created! Log in now!');
			navigate('/');
		}
	};

	const [createAccountMutation, { data: createAccountMutationResult, loading }] = useMutation(
		CREATE_ACCOUNT_MUTATION,
		{ onCompleted },
	);

	const onSubmit: SubmitHandler<IFormData> = ({ email, password, role }) => {
		if (!loading) {
			createAccountMutation({
				variables: {
					createAccountInput: {
						email,
						password,
						role,
					},
				},
			});
		}
	};

	return (
		<div className='flex items-center flex-col mt-10 lg:mt-28'>
			<Helmet>
				<title>Create Account | Uber Eats</title>
			</Helmet>
			<div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
				<img src={nuberLogo} className='w-52 mb-10' alt='Nuber Eats' />
				<h4 className='w-full font-medium text-left text-3xl mb-5'>{"Let's get started"}</h4>
				<form noValidate className='grid gap-3 mt-5 w-full mb-5' onSubmit={handleSubmit(onSubmit)}>
					<input
						className='input'
						type='email'
						placeholder='Email'
						{...register('email', {
							required: 'Email is required',
							pattern:
								/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
						})}
					/>
					{errors.email?.type === 'pattern' && <FormError errorMessage={'Please enter a valid email'} />}
					{errors.email?.message && <FormError errorMessage={errors.email?.message} />}

					<input
						className='input'
						type='password'
						placeholder='Password'
						{...register('password', {
							required: 'Password is required',
						})}
					/>
					{errors.password?.message && <FormError errorMessage={errors.password?.message} />}

					<select
						placeholder='Role'
						className='input'
						{...register('role', { required: 'Role is required' })}
					>
						{Object.values(UserRole).map(role => {
							return <option key={role}>{role}</option>;
						})}
					</select>
					{errors.role?.message && <FormError errorMessage={errors.role.message} />}

					<Button canClick={isValid} actionText={'Create Account'} loading={loading} />
					{createAccountMutationResult?.createAccount.error && (
						<FormError errorMessage={createAccountMutationResult.createAccount.error} />
					)}
				</form>
				<div>
					Already have an account?{' '}
					<Link to='/' className='text-lime-600 hover:underline'>
						Log in now
					</Link>
				</div>
			</div>
		</div>
	);
};
