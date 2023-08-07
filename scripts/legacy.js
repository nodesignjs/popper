import { DEFAULT_EXTENSIONS } from '@babel/core'
import { createBabelInputPluginFactory } from '@rollup/plugin-babel'

const plugin = createBabelInputPluginFactory(() => ({
  options() {
    return {
      pluginOptions: {
        extensions: [
          ...DEFAULT_EXTENSIONS,
          '.ts', '.tsx'
        ],
        babelHelpers: 'bundled',
      },
    };
  },
  config(config) {
    if (config.hasFilesystemConfig()) {
      return config.options;
    }
    return {
      ...config.options,
      plugins: (config.options.plugins || []).filter(Boolean),
      presets: [
        ...(config.options.presets || []),
        [
          '@babel/preset-env',
          {
            modules: false,
            bugfixes: true,
            loose: false,
            useBuiltIns:  false,
            shippedProposals: true
          },
        ]
      ]
    }
  },
}));

export default () => ({
  ...plugin(),
  enforce: 'post',
})
