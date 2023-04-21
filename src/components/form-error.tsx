import { FC } from 'react';

interface IFormErrorProps {
	errorMessage: string;
}

export const FormError: FC<IFormErrorProps> = ({ errorMessage }) => (
	<span role="alert" className="font-medium text-red-500">
		{errorMessage}
	</span>
);
