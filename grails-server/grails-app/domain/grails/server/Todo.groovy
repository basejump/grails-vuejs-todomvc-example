package grails.server

import grails.rest.Resource

@Resource(uri = '/todo', namespace = '/api', formats = ["json"])
class Todo {
	
	String title
	Boolean completed = false
	Boolean archived = false

    static constraints = {
    	title nullable: false, notEqual: "xxx"
    	completed nullable: false
    	archived nullable: false
    }
}