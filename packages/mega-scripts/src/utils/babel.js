export default function(context, opts = {}) {
  return {
    presets: [[require.resolve('@lugia/babel-preset-mega'), opts]],
  };
}
