export default function(ops = {}) {
  return {
    presets: [[require.resolve('@lugia/babel-preset-mega'), ops]],
  };
}
