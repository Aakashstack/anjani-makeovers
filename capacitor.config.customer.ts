import type { CapacitorConfig } from '@capacitor/cli';

// Customer-facing app — opens to the homepage
const config: CapacitorConfig = {
  appId: 'app.lovable.anjanimakeovers.customer',
  appName: 'Anjani Makeovers',
  webDir: 'dist',
  server: {
    url: 'https://0ca2655d-1b9a-4680-a0b8-ce5ff0e176fa.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
};

export default config;
