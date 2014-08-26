

define(['require','angular','common/i18n/languageServices'],function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');

	var moduleName = 'kasparGUI.operators.directives';
	var dependancies = [
						languageServices, 
						];

	var module = angular.module(moduleName, dependancies);

	return moduleName;
});
