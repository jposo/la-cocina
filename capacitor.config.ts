import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.lacocina.app",
    appName: "Mexicocina",
    webDir: "build",
    bundledWebRuntime: false,
    server: {
        hostname: "localhost",
    },
};

export default config;
