// Optional pnpm configuration file
// This can be used for advanced dependency resolution if needed
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Example: Fix peer dependency issues
      // if (pkg.name === 'some-package') {
      //   pkg.peerDependencies = pkg.peerDependencies || {};
      // }
      return pkg;
    }
  }
};

