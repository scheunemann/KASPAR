'use strict';

define(function(require) {
	var angular = require('angular');
	var languageServices = require('common/i18n/languageServices');
	
	var moduleName = 'kasparGUI.teacher.controllers';
	var dependancies = [
						languageServices,
						];
	
	var module = angular.module(moduleName, dependancies)
		;
	
	return moduleName;
});	
