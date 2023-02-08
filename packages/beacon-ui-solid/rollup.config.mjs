import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import withSolid from 'rollup-preset-solid'

export default withSolid([
  {
    input: 'src/index.ts',
    output: '.',
    plugins: [postcss(), typescript()]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs'
      },
      {
        file: 'dist/esm/index.js',
        format: 'esm'
      }
    ],
    plugins: [postcss(), typescript()]
  }
])
