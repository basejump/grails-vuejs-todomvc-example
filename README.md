<img align="right" src="https://cloud.githubusercontent.com/assets/187726/25786548/f88e486c-335c-11e7-8af0-8a7c470e4112.png" width="350">

<!-- MarkdownTOC autolink="true" bracket="round" -->

- [Overview](#overview)
- [Phase 1 - Stock Vuejs front end](#phase-1---stock-vuejs-front-end)
- [Phase 2 - TodoMVC files](#phase-2---todomvc-files)
- [Phase 3 - Stock Grails Rest Application](#phase-3---stock-grails-rest-application)
- [Phase 4 - Grails Todo Rest Setup](#phase-4---grails-todo-rest-setup)
- [Phase 5 - Vue TodoMVC modifications for rest model](#phase-5---vue-todomvc-modifications-for-rest-model)
- [Phase 6 - Use v-model axios rest wrapper. Add error checking](#phase-6---use-v-model-axios-rest-wrapper-add-error-checking)
- [Phase 7 - vue-router](#phase-7---vue-router)
- [Phase 8 - vuex](#phase-8---vuex)
- [Refs](#refs)
  - [examples TodoMVC inspiration](#examples-todomvc-inspiration)
  - [Admin Dashobards](#admin-dashobards)
  - [Testing](#testing)

<!-- /MarkdownTOC -->

## Overview

This is a project I used to attemp to learn the basics of Vue. I consider one of those neccesarry basics to be how to communicate using a rest api with [Grails][]. I takes the [Vue.js][Vue] TodoMVC example and modifies it to use a [Grails] app to store the data.
TodoMVC example initially taken from the poc site http://todomvc.com/ bubt then ended up using this one as a basis for the code https://vuejs.org/v2/examples/todomvc.html Take a look at the end of this artcle for other links and projects I used as examples and tutorials.

## Phase 1 - Stock Vuejs front end
https://github.com/basejump/grails-vue-todomvc/tree/Phase1-vue-init-webpack

Install the [vue-cli] and create a template

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
[see github tag phase2-todomvc-example-copy](https://github.com/basejump/grails-vue-todomvc/tree/Phase2-todomvc-example-copy)

Copy code from https://vuejs.org/v2/examples/todomvc.html according to these [commits](https://github.com/basejump/grails-vue-todomvc/commit/e44c9aaa33b2d639a034ce95688e3235607b857c).

`npm run dev` and check it out

## Phase 3 - Stock Grails Rest Application
[github tag Phase3-Stock-Grails-Rest-App](https://github.com/basejump/grails-vue-todomvc/tree/Phase3-Stock-Grails-Rest-App)


``` bash
$ grails create-app -profile rest-api -features hibernate5 grails-server

| Grails Version: 3.2.9
```

## Phase 4 - Grails Todo Rest Setup
see [this commit](https://github.com/basejump/grails-vue-todomvc/commit/2c252c176a8ffbe411883a661eb9d504a83a5ca1) for a walk through of the changes made

create the Todo domain

``` bash
$ grails create-domain-class Todo
```

``` groovy
import grails.rest.Resource

@Resource(uri = '/todo', namespace = '/api', formats = ["json"])
class Todo {

  String title
  Boolean completed = false
  Boolean archived = false

    static constraints = {
      title nullable: false
      completed nullable: false
      archived nullable: false
    }
}
```

turn on cors in the application.yml

```
grails:
    cors:
        enabled: true
```

add some rows for sanity check
``` groovy
class BootStrap {
    def init = { servletContext ->
        new Todo(title:"Buy beer",completed:true).save(failOnError:true,flush: true)
        new Todo(title:"Drink beer").save(failOnError:true,flush: true)
        new Todo(title:"Create Vue/Grails TodoMVC example").save(failOnError:true,flush: true)
    }
...
```

`grails run-app` and sanity check it with curl

``` bash
$ curl -i -X GET -H "Content-Type: application/json"  localhost:8080/todo
HTTP/1.1 200
X-Application-Context: application:development
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
Date: Sun, 07 May 2017 06:01:57 GMT

[{"id":1,"archived":false,"completed":false,"title":"Buy beer"},{"id":2,"archived":false,"completed":false,"title":"Drink beer"}]
```

## Phase 5 - Vue TodoMVC modifications for rest model
[see this commit for changes](https://github.com/basejump/grails-vue-todomvc/commit/37da7efa416993a2b942ac7746778473e24d9ddf)

1. `npm install axios --save` modify package.json per example and run npm install

2. modify vue-app/config/index.js to change port to 8090 so it doesn't conflict with grails

3. create new src/todoRestApi.js for communication with grails. See file.

4. modify src/main.js to use the new todoModel.js instead of the local storage `todoStorage` from original example

5. Make minor tweak to the complete check box to use even for save

5. `grails run-app` under the grail-server dir. In another shell window cd to vue-app and run 'npm run dev'

## Phase 6 - Use v-model axios rest wrapper. Add error checking
<img align="right" src="https://cloud.githubusercontent.com/assets/187726/25831513/519da1be-342a-11e7-8292-d723f152c0af.png" width="300">

[see this commit for changes](https://github.com/basejump/grails-vuejs-todomvc-example/commit/b657f26b2eb6a580171bb634795916990a5f1862)

[vmodel] is a light weight wrapper around [axios] that allows you to use it more like ngResource and will even look somewhat similiar to Gorm/Grails activerecord way of working with items. While it says its for Vue, vue is not required and [axios]is all thats needed and since its [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based API as well.


1. `npm install v-model --save` or modify package.json per example and run npm install

2. added todoModel.js to replace the axios based todoRestApi from phase 5

3. modified main.js to use todoModel and the [vmodel] model based methods

4. Add some error checking with `catch` and a div in index.html to diplay errors

5. Modify the Todo domain in grails so we can simulate an error by creaating an item with 'xxx'

6. `grails run-app` under the grail-server dir. In another shell window cd to vue-app and run 'npm run dev'

Try creating a todo with _xxx_ as the title or modifying an existing one.

## Phase 7 - vue-router
see [this commit](https://github.com/basejump/grails-vuejs-todomvc-example/commit/ae8ded8344ad8e4be2217d6f2d9cb1448c317d06) for relevant changes.

[vue-router] provide route and url view mapping. We were taking the url and parsing it with `function onHashChange ()` and `window.addEventListener('hashchange', onHashChange)`. We have `<a>` links to change the url for the filters on (all,active,completed). The event listener bascially took the url when it changed from `http://localhost:8090/#/` to `http://localhost:8090/#/completed` and parse off the 'completed' part which is used to then propogate a refilter by setting `this.visibility`. [vue-router] is the stadard way of dealing with what to do when the url changes. Should already be installed.


1. Refactor index.html to use router-link

2. Update main.js per commits to add the router. The docs were light on this as most examples talked about how to tie the routes to the componenets to show. Turns out its optional and we can use the `$router` var that get injected into the Vue.


## Phase 8 - vuex

See this [branch](https://github.com/basejump/grails-vuejs-todomvc-example/tree/vuex) for working example

8a - get vuex working with local storage

8b - [Grails] rest storage


**Inspiration Articles/Docs**

* [vuex] docs read through completly
* [state changes ans 2-way databinding idea with vuex](https://ypereirareis.github.io/blog/2017/04/25/vuejs-two-way-data-binding-state-management-vuex-strict-mode/)
* a good overview that includes some rest examples [here](https://medium.com/@bradfmd/vue-vuex-getting-started-f78c03d9f65)
* [Learn Vuex by Building a Notes App](https://coligo.io/learn-vuex-by-building-notes-app/)

**Inspiration Projects and Examples**

* The [vuex example](https://github.com/vuejs/vuex/tree/dev/examples/todomvc) in the main source
* another vuex with JSX example https://github.com/codingcampbell/todomvc-vue
* https://github.com/christianmalek/vuex-rest-api
* complicated project with modules (in chinese) https://github.com/jackhutu/jackblog-vue/tree/master/src/vuex
* old but good examples https://github.com/pablohpsilva/Goal

## Refs

### examples TodoMVC inspiration

super simple https://github.com/addyosmani/vue-cli-todomvc
older but has components examples and test examples https://github.com/allenmyao/vuejs-todomvc/tree/master/src
vuex example with JSX, also shows SCSS style use https://github.com/codingcampbell/todomvc-vue

### Admin Dashobards
front end comparison https://docs.google.com/spreadsheets/d/13WhGNOu9S207TmhkL4xhCHV0tlDg-rCzR0VeaspS8QQ/edit#gid=541415243
https://quasar-admin.firebaseapp.com/#/
https://github.com/prograhammer/example-vue-project

### Testing
https://www.coding123.org/mock-vuex-in-vue-unit-tests/
https://alligator.io/vuejs/testing-vuex-vue/


[Vuex]: https://vuex.vuejs.org/en/
[axios]: https://github.com/mzabriskie/axios
[vmodel]: https://github.com/laoshu133/v-model
[vue-router]: https://router.vuejs.org/en/
[vue-cli]: https://github.com/vuejs/vue-cli
[Grails]: https://grails.org/
[Vue]: https://vuejs.org/
