# Building Native APKs (Customer + Admin)

Lovable's cloud sandbox cannot compile APKs. You'll do the final build on your own computer (one-time setup), then rebuild any time with one command.

## One-time setup on your computer

1. Install **Android Studio**: https://developer.android.com/studio (includes Java SDK)
2. **Export to GitHub** from Lovable (top-right button) and `git clone` it
3. In the project folder:
   ```bash
   npm install
   npm run build
   ```

## Build the CUSTOMER APK

```bash
cp capacitor.config.customer.ts capacitor.config.ts
npx cap add android        # first time only
npx cap sync android
npx cap open android       # opens Android Studio
```
In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
The APK appears at `android/app/build/outputs/apk/debug/app-debug.apk`.

Rename it `anjani-makeovers.apk` and install on your phone.

## Build the ADMIN APK

> ⚠️ Different `appId` (`...admin` vs `...customer`) so Android treats them as separate apps and both can be installed side-by-side.

```bash
# Remove the customer android folder so we can build a fresh one for admin
rm -rf android
cp capacitor.config.admin.ts capacitor.config.ts
npx cap add android
npx cap sync android
npx cap open android
```
Build APK in Android Studio again → rename to `anjani-admin.apk`.

## Switching back to update the customer app later

```bash
rm -rf android
cp capacitor.config.customer.ts capacitor.config.ts
npx cap add android
npx cap sync android
```
(Or keep two cloned folders, one per app — easier long-term.)

## Notes

- The `server.url` in the configs points to your Lovable preview, so the apps always show your latest published site — no rebuild needed for content changes.
- If you switch to your own custom domain later, update the URL in both `capacitor.config.customer.ts` and `capacitor.config.admin.ts`.
- For the Play Store you'll need a **release** (signed) APK — Android Studio: **Build → Generate Signed Bundle / APK**.
- After any pull from Lovable, run `npm install && npm run build && npx cap sync android`.

Read more: https://lovable.dev/blog/building-mobile-apps-with-lovable-and-capacitor
