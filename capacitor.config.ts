import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dayflow.app',
  appName: 'Dayflow',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorSQLite: {
      databaseName: 'dayflow_db',
      version: 1,
      encrypted: false,
      mode: 'no-encryption',
      overrideUserDefault: true,
    },
    Preferences: {
      group: 'dayflow_preferences',
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    loggingBehavior: 'none',
    appendUserAgent: 'Dayflow/1.0',
    backgroundColor: '#F4F1FE',
    enableScroll: false,
    handleFileChooser: true,
    initialFocus: true,
    mixedContentMode: 'never_allow',
    overrideUserAgent: 'Dayflow/1.0',
    scale: 'device',
    useLegacyBridge: false,
    zoomEnabled: false,
  },
};

export default config;
