// Default config — symlinked to customer config.
// To switch which app you're building, copy one of:
//   capacitor.config.customer.ts  (customer app)
//   capacitor.config.admin.ts     (admin app)
// over this file before running `npx cap sync android`.
import type { CapacitorConfig } from '@capacitor/cli';

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
