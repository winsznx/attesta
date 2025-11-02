/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize compilation speed
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Exclude heavy dependencies from transpilation
  transpilePackages: [
    '@reown/appkit',
    '@reown/appkit-adapter-wagmi',
  ],

  webpack: (config, { isServer, dev }) => {
    // Faster builds in dev
    if (dev) {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Exclude heavy libs from being processed by webpack
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@react-native-async-storage/async-storage": false,
        "pino-pretty": false,
        // Only load Three.js when needed (code splitting)
        "three": require.resolve("three"),
      };
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@react-native-async-storage/async-storage": false,
        "pino-pretty": false,
      };
    }

    // Faster module resolution
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      'node_modules',
    ];

    // Ignore warnings for optional dependencies
    config.ignoreWarnings = [
      {
        module: /pino/,
        message: /pino-pretty/,
      },
      {
        module: /node_modules/,
        message: /Critical dependency/,
      },
    ];

    return config;
  },
  
  // Optimize page loading
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // Keep pages in memory longer
    pagesBufferLength: 5, // Increase buffer
  },

  // Experimental features for faster builds
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'framer-motion',
    ],
  },

  // Disable TypeScript checking in dev (Next.js handles it)
  typescript: {
    // Type checking is done separately - don't slow down dev server
    ignoreBuildErrors: false, // Still check in production builds
  },
  
  // Disable ESLint during dev builds for faster startup
  eslint: {
    ignoreDuringBuilds: false, // Still check in production builds
  },
};

module.exports = nextConfig;

