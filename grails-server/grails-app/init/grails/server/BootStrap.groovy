package grails.server

class BootStrap {
    def init = { servletContext ->
        new Todo(title:"Buy beer",completed:true).save(failOnError:true,flush: true)
        new Todo(title:"Drink beer").save(failOnError:true,flush: true)
        new Todo(title:"Create Vue/Grails TodoMVC example").save(failOnError:true,flush: true)
    }
    def destroy = {
    }
}
