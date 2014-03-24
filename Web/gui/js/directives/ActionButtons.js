(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'js/services/proxyServices', 
	                     'js/services/displayServices', 
	                     'js/models/UserAction' 
	                     ];

	define(dependancies, function(angular, proxyServices, displayServices, UserAction) {

		var ActionButtons = function($q, proxyObjectResolver, UserAction, hotkeyFormatter) {
			return {
				templateUrl : 'partials/interaction/actionButtons.html',
				restrict : 'E',
				scope : {
					buttons : "=",
					user : "=",
					interaction : "=",
					showHotKeys : "=",
					keyBind : "=",
				},
				link : function(scope, element, attrs, controller) {
				},
				controller : function($scope) {
				},
			};
		};

		return [ '$q', 'proxyObjectResolver', 'UserAction', 'hotkeyFormatter', ActionButtons ];
	});
}());
