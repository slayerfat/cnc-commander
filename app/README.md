# Project structure

./package.json is for all your development needs

Here you should install modules that you only need during development. Items include scripts, pre-processors, module loaders, etc. In this boilerplate all of the webpack dependencies are saved here and will not be published in final production builds.

./app/package.json is for your actual electron app

This package.json is your app's manifest. Here you should install all your dependencies needed in your final app. It is inside this app folder that electron-packager/electron-builder will create final production builds.

https://simulatedgreg.gitbooks.io/electron-vue/content/en/project_structure.html
