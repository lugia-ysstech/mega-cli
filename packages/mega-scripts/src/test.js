import jest from '@lugia/mega-jest';

const args = process.argv.slice(2);

const watch = args.indexOf('-w') > -1 || args.indexOf('--watch') > -1;
const coverage = args.indexOf('--coverage') > -1;

jest({
  watch,
  coverage,
}).catch(e => {
  console.log(e);
  process.exit(1);
});
