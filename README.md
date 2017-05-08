<p align="center"><img src="https://cloud.githubusercontent.com/assets/187726/25786548/f88e486c-335c-11e7-8af0-8a7c470e4112.png" width="300"></p>

# Overview

Takes the Vue.js TodoMVC example and modifies it to use a Grails app to store the data.
TodoMVC examples from http://todomvc.com/
Uses this one for a base https://vuejs.org/v2/examples/todomvc.html

## Phase 1 - Stock Vuejs front end
https://github.com/basejump/grails-vue-todomvc/tree/Phase1-vue-init-webpack

Install the [vue-cli](https://github.com/vuejs/vue-cli) and create a template

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

Copy code from https://vuejs.org/v2/examples/todomvc.html according to commits. 

`npm run dev` and check it out

## Phase 3 - Stock Grails Rest Application
https://github.com/basejump/grails-vue-todomvc/tree/Phase3-Stock-Grails-Rest-App

``` bash
$ grails create-app -profile rest-api -features hibernate5 grails-server

| Grails Version: 3.2.9
```

## Phase 4 - Grails Todo Rest Setup
see this [commit](https://github.com/basejump/grails-vue-todomvc/commit/2c252c176a8ffbe411883a661eb9d504a83a5ca1) for a walk through of the changes made

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







