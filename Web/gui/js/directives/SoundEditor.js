(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'js/services/proxyServices'
	                     ];

	define(dependancies, function(angular, proxyServices) {

		var SoundEditor = function(proxyObjectResolver) {
			return {
				templateUrl : 'partials/action/sound.html',
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
