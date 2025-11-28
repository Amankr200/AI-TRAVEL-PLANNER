import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

 
export default defineConfig({
  base: '/AI-TRAVEL-PLANNER/',    
  plugins: [
    tailwindcss(),
    react()
  ],
  define: {
    'process.env': {
      VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID,
    }
  }
});
