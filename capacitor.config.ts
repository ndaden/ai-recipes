import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dnabil.airecipes",
  appName: "ai-recipes",
  webDir: "out",
  server: {
    url: "http://192.168.1.69:3000",
    cleartext: true,
  },
};

export default config;
