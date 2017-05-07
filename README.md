# grails-vue-todomvc
Vue.js with Grails using the TodoMVC example

## Phase 1 - Stock Vuejs front end
https://github.com/basejump/grails-vue-todomvc/tree/Phase1-vue-init-webpack

``` bash
$ vue init webpack vue-app

  This will install Vue 2.x version of the template.

? Project name vue-app
? Project description Vue.js todoMVC front end for Grails
? Author basejump <xxx@9ci.com>
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Setup unit tests with Karma + Mocha? Yes
? Setup e2e tests with Nightwatch? Yes

   vue-cli · Generated "vue-app".

   To get started:

     cd vue-app
     npm install
     npm run dev

   Documentation can be found at https://vuejs-templates.github.io/webpack
```

now npm run dev should work and show the todo with local browser storage


## Phase 2 - TodoMVC files
https://github.com/basejump/grails-vue-todomvc/tree/Phase2-todomvc-example-copy

Copy setup from https://vuejs.org/v2/examples/todomvc.html

## Phase 3 - Stock Grails Rest Application

``` bash
$ grails create-app -profile rest-api -features hibernate5 grails-server

| Grails Version: 3.2.9
```
