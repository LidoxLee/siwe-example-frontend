const path = require("path");

module.exports = {
  reactStrictMode: false,
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    serverActions: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push("pino-pretty", {
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};
