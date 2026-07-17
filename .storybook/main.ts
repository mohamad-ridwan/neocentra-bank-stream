import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/nextjs",
  "staticDirs": [
    "../public"
  ],
  async webpackFinal(config) {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "shared_remote/store": path.resolve(__dirname, "../../neocentra-bank-shared/src/store/index.ts"),
        "shared_remote/Button": path.resolve(__dirname, "../../neocentra-bank-shared/src/components/ui/button.tsx"),
        "shared_remote/Input": path.resolve(__dirname, "../../neocentra-bank-shared/src/components/ui/input.tsx"),
        "shared_remote/Dialog": path.resolve(__dirname, "../../neocentra-bank-shared/src/components/ui/dialog.tsx"),
        "shared_remote/apiHelper": path.resolve(__dirname, "../../neocentra-bank-shared/src/utils/apiHelper.ts"),
        "shared_remote/AuthWrapper": path.resolve(__dirname, "../../neocentra-bank-shared/src/components/AuthWrapper.tsx"),
        "shared_remote/Tooltip": path.resolve(__dirname, "../../neocentra-bank-shared/src/components/ui/tooltip.tsx"),
        "shared_remote/DropdownMenu": path.resolve(__dirname, "../../neocentra-bank-shared/src/components/ui/dropdown-menu.tsx"),
        "shared_remote/useRemoteCSS": path.resolve(__dirname, "../../neocentra-bank-shared/src/hooks/useRemoteCSS.ts"),
        "shared_remote/federatedStats": path.resolve(__dirname, "../../neocentra-bank-shared/src/utils/federated-stats.ts"),
        "shared_remote/Skeleton": path.resolve(__dirname, "../../neocentra-bank-shared/src/components/ui/skeleton.tsx"),
        "shared_remote/Toast": path.resolve(__dirname, "../../neocentra-bank-shared/src/components/ui/toast.tsx"),
        "sonner": path.resolve(__dirname, "../node_modules/sonner"),
      };
      config.resolve.modules = [
        path.resolve(__dirname, "../node_modules"),
        ...(config.resolve.modules || []),
      ];
    }

    const sharedPath = path.resolve(__dirname, "../../neocentra-bank-shared");
    if (config.module && config.module.rules) {
      config.module.rules.forEach((rule: any) => {
        if (!rule) return;
        if (rule.include) {
          if (Array.isArray(rule.include)) {
            rule.include.push(sharedPath);
          } else {
            rule.include = [rule.include, sharedPath];
          }
        }
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOfRule: any) => {
            if (oneOfRule.include) {
              if (Array.isArray(oneOfRule.include)) {
                oneOfRule.include.push(sharedPath);
              } else {
                oneOfRule.include = [oneOfRule.include, sharedPath];
              }
            }
          });
        }
      });
    }

    return config;
  }
};
export default config;