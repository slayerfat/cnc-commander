# CNC Commander

> An electron-vue project

## Validation

- string validators https://github.com/skaterdav85/validatorjs
- string sanitizer https://github.com/punkave/sanitize-html
- Form validation https://github.com/logaretm/vee-validate

## Database

- relational pouch https://github.com/nolanlawson/relational-pouch
- bcrypt implementation https://www.npmjs.com/package/bcryptjs

## Tests

To run mocha with es6 on Webstorm we must set the extra mocha options to `--compilers js:babel-core/register` 
(set the mocha defaults to the same with working directory).

Inside the .babelrc file (or put in package.json)

```json
{
  "presets": [
    "es2015"
  ]
}
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron app for production
npm run build

# lint all JS/Vue component files in `app/src`
npm run lint

# run webpack in production
npm run pack
```
More information can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/docs/npm_scripts.html).

---

This project was generated from [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about this project can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
