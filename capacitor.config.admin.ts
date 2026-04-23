import type { CapacitorConfig } from '@capacitor/cli';

// Admin-only app — opens directly to /admin/login
const config: CapacitorConfig = {
  appId: 'app.lovable.anjanimakeovers.admin',
  appName: 'Anjani Admin',
  webDir: 'dist',
  server: {
    url: 'https://0ca2655d-1b9a-4680-a0b8-ce5ff0e176fa.lovableproject.com/admin/login?forceHideBadge=true',
    cleartext: true,
  },
};

export default config;
