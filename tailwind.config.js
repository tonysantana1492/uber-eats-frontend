const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	media: false,
	theme: {
		extend: {
			colors: {
				lime: colors.lime,
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
