running live at: [https://github.com/AvneeshSarwate/react_animated_spreadsheet](https://avneeshsarwate.github.io/react_animated_spreadsheet/)

A quick experiment in learning React state management and render optimization. 

This repo uses https://hyperformula.handsontable.com/ as a headless spreadsheet engine.

It uses https://valtio.pmnd.rs/ as a state management library.

It passes the spreadsheet data to a p5.js draw function. 

You can livecode the draw function in an embedded Monaco typescript editor. 

Typings for p5.js are provided to the in browser editor. 

It uses https://sucrase.io/ and https://github.com/acornjs/acorn to parse typescript and convert it to javascript that can be run via a [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/function)



It uses Vite as a build tool.

To run locally, clone the repo and run `npm install` and `npm run dev`.
The console will spit out a url like `http://localhost:5174/react_animated_spreadsheet/` which you can open in your browser.





####  autogen readme from vite template below

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
