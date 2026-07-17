const NextFederationPlugin = require("@module-federation/nextjs-mf");
const path = require("path");

const getRemoteUrl = (name, defaultLocalUrl) => {
  if (process.env.NODE_ENV === "production") {
    // In production, Nginx handles routing under a single domain via subpaths
    return `${name}_remote@/mf-${name}/_next/static/chunks/remoteEntry.js`;
    // return `${name}_remote@${defaultLocalUrl}/_next/static/chunks/remoteEntry.js`;
  }
  return `${name}_remote@${process.env[`NEXT_PUBLIC_REMOTE_${name.toUpperCase()}_URL`] || defaultLocalUrl}/_next/static/chunks/remoteEntry.js`;
};

module.exports = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "stream_remote",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            shared_remote: getRemoteUrl("shared", "http://localhost:3342"),
          },
          exposes: {
            "./Stream": "./src/components/Stream/index.tsx",
          },
          shared: {
            react: { singleton: true, requiredVersion: false },
            "react-dom": { singleton: true, requiredVersion: false },
            "@reduxjs/toolkit": { singleton: true },
            "react-redux": { singleton: true },
            "@tanstack/react-query": { singleton: true },
          },
        }),
      );
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        "shared_remote/store": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/store/index.ts",
        ),
        "shared_remote/Button": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/components/ui/button.tsx",
        ),
        "shared_remote/Input": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/components/ui/input.tsx",
        ),
        "shared_remote/apiHelper": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/utils/apiHelper.ts",
        ),
        "shared_remote/AuthWrapper": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/components/AuthWrapper.tsx",
        ),
        "shared_remote/Tooltip": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/components/ui/tooltip.tsx",
        ),
        "shared_remote/DropdownMenu": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/components/ui/dropdown-menu.tsx",
        ),
        "shared_remote/useRemoteCSS": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/hooks/useRemoteCSS.ts",
        ),
        "shared_remote/federatedStats": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/utils/federated-stats.ts",
        ),
        "shared_remote/Skeleton": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/components/ui/skeleton.tsx",
        ),
        "shared_remote/Dialog": path.resolve(
          __dirname,
          "../neocentra-bank-shared/src/components/ui/dialog.tsx",
        ),
      };
    }
    return config;
  },
};
