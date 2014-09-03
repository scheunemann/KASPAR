

define(['require','angular','./controllers','./directives','./models'],function(require) {
	var angular = require('angular');
	var controllers = require('./controllers');
	var directives = require('./directives');
	var models = require('./models');

	var moduleName = 'kasparGUI.triggers';
	var dependancies = [ 
						controllers,
						directives,
						models
					];

	var module = angular.module(moduleName, dependancies);
	return moduleName;
});
