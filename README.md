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
https://github.com/basejump/grails-vue-todomvc/tree/Phase3-Stock-Grails-Rest-App

``` bash
$ grails create-app -profile rest-api -features hibernate5 grails-server

| Grails Version: 3.2.9
```

## Phase 4 - Grails Todo Rest Setup

create the Todo domain

``` bash
$ grails create-domain-class Todo
```

``` groovy
import grails.rest.Resource

@Resource(uri = '/todo', formats = ["json"])
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

run-app and sanity check it with curl

``` bash
$ curl -i -X GET -H "Content-Type: application/json"  localhost:8080/todo
HTTP/1.1 200
X-Application-Context: application:development
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
Date: Sun, 07 May 2017 06:01:57 GMT

[{"id":1,"archived":false,"completed":false,"title":"Buy beer"},{"id":2,"archived":false,"completed":false,"title":"Drink beer"}]
```