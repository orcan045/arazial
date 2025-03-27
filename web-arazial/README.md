# Arazial Web Application

Web version of the Arazial land auction platform.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm start
```

## Production Build

```bash
# Create production build
npm run build
```

## Deployment

This project is configured for deployment on Vercel.

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Vercel will automatically deploy the application

## Environment Variables

The following environment variables are required:

- `REACT_APP_SUPABASE_URL`: Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anonymous API key 