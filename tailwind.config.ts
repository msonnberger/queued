import { Config } from 'tailwindcss';
import default_theme from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			spacing: {
				sidebar: default_theme.spacing[96]
			},
			fontFamily: {
				sans: ['Inter var', ...default_theme.fontFamily.sans]
			}
		}
	},
	plugins: [],
	darkMode: 'class'
} satisfies Config;
