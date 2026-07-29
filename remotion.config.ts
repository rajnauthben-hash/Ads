/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);

// The sandbox routes outbound HTTPS through a proxy whose CA the bundled
// Chromium does not trust. Google Fonts (loaded via @remotion/google-fonts)
// would otherwise fail with ERR_CERT_AUTHORITY_INVALID, so allow the render
// browser to proceed past the proxy certificate.
Config.setChromiumIgnoreCertificateErrors(true);

// Local font files (public/fonts/) are loaded once per browser tab via
// @remotion/fonts. Under high render concurrency this can race past the
// default delayRender() timeout, so concurrency is capped and the timeout
// is raised here to keep renders reliable.
Config.setConcurrency(1);
Config.setDelayRenderTimeoutInMilliseconds(120000);

// Pre-installed Chromium in this sandbox environment (not present on other
// machines/CI, where `npx remotion browser ensure` manages its own browser).
const sandboxBrowser =
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(sandboxBrowser)) {
  Config.setBrowserExecutable(sandboxBrowser);
}
