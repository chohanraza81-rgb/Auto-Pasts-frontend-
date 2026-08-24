import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#f59e0b'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            h2: {
              fontWeight: '700',
              marginTop: '2rem',
              marginBottom: '1rem',
              lineHeight: '1.3',
            },
            h3: {
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            p: {
              marginTop: '1rem',
              marginBottom: '1rem',
              lineHeight: '1.7',
            },
            ul: {
              margin: '1rem 0',
              paddingLeft: '1.5rem',
            },
            li: {
              marginBottom: '0.5rem',
              lineHeight: '1.6',
            },
            a: {
              color: '#1e40af',
              textDecoration: 'underline',
            },
            img: {
              borderRadius: '8px',
              margin: '1.5rem 0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
