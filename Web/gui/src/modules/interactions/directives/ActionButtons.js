'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	require('common/services/displayServices');
	require('actions/models');

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
