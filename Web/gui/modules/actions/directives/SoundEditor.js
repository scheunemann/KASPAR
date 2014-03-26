(function() {
	'use strict';

	var dependancies = [ 
	                     'angular',
	                     'text!./soundEditor.tpl.html',
	                     'common/services/proxyServices'
	                     ];

	define(dependancies, function(angular, template, proxyServices) {

		var SoundEditor = function(proxyObjectResolver) {
			return {
				template : template,
				restrict : 'E',
				scope : {
					sound : "=action",
				},
				controller : function($scope) {
				},
			};
		}

		return [ 'proxyObjectResolver', SoundEditor ];
	});
}());
