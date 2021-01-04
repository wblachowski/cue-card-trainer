const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  resolver: {
    sourceExts: ["jsx", "js", "json", "ts", "tsx"],
    assetExts: [...defaultConfig.resolver.assetExts, "db"],
  },
};
