import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

interface IProp {
	children: React.ReactNode;
}

export const AllTheProviders: React.FC<IProp> = ({ children }) => {
	return (
		<HelmetProvider>
			<BrowserRouter>{children}</BrowserRouter>
		</HelmetProvider>
	);
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
	userEvent.setup();
	return render(ui, { wrapper: AllTheProviders, ...options });
};

// re-export everything
export * from '@testing-library/react';

export { customRender as render };
