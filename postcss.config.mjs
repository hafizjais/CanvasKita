// Tailwind CSS v4 through PostCSS. Works with both bundlers: Turbopack in
// `next dev` and webpack in `next build` (see the build script in package.json).
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
