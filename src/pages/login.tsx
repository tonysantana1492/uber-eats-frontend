import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@apollo/client';

import nuberLogo from '../images/logo.svg';
import { FormError } from '../components/form-error';
import { Button } from '../components/button';
import { graphql } from '../gql';
import { LoginMutation } from '../gql/graphql';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';

export const LOGIN_MUTATION = graphql(`
	mutation login($loginInput: LoginInput!) {
		login(input: $loginInput) {
			ok
			error
			token
		}
	}
`);

type IFormData = {
	email: string;
	password: string;
};

export const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<IFormData>({
		mode: 'onChange',
	});

	const onCompleted = (data: LoginMutation) => {
		const {
			login: { ok, token },
		} = data;

		if (ok && token) {
			localStorage.setItem(LOCALSTORAGE_TOKEN, token);
			authTokenVar(token);
			isLoggedInVar(true);
		}
	};

	const [loginMutation, { loading, data: loginMutationResult }] = useMutation(LOGIN_MUTATION, { onCompleted });

	const onSubmit: SubmitHandler<IFormData> = ({ email, password }) => {
		if (!loading) {
			loginMutation({
				variables: {
					loginInput: {
						email,
						password,
					},
				},
			});
		}
	};

	return (
		<div className='flex items-center flex-col mt-10 lg:mt-28'>
			<Helmet>
				<title>Login | Uber Eats</title>
			</Helmet>
			<div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
				<img src={nuberLogo} className='w-52 mb-10' alt='Uber Eats' />
				<h4 className='w-full font-medium text-left text-3xl mb-5'>Welcome back</h4>
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
					<Button canClick={isValid} loading={loading} actionText={'Log in'} />
					{loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
				</form>
				<div>
					New to Uber?{' '}
					<Link to='/create-account' className='text-lime-600 hover:underline'>
						Create an Account
					</Link>
				</div>
			</div>
		</div>
	);
};
