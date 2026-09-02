import type { ConfigContext, ExpoConfig } from 'expo/config';

const androidGoogleServicesFile = process.env.GOOGLE_SERVICES_JSON ?? './google-services.json';
const iosGoogleServicesFile = process.env.GOOGLE_SERVICE_INFO_PLIST ?? './GoogleService-Info.plist';

/**
 * EAS-provided config. In cloud builds the git-ignored Firebase native config
 * files are supplied as EAS secret file variables (GOOGLE_SERVICES_JSON /
 * GOOGLE_SERVICE_INFO_PLIST); locally we fall back to the repo's files.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  ios: {
    ...config.ios,
    googleServicesFile: iosGoogleServicesFile,
  },
  android: {
    ...config.android,
    googleServicesFile: androidGoogleServicesFile,
  },
});
