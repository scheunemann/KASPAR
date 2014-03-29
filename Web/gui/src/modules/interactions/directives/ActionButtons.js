'use strict';

define([ 
         'angular', 
         'common/services/proxyServices', 
         'common/services/displayServices', 
         'actions/models',
         ], function(angular, proxyServices, displayServices, actionModels) {

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
