'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	require('common/services/displayServices');
	require('actions/models');
	var template = require('text!./actionButton.tpl.html');

	var ActionButton = function($q, $timeout, proxyObjectResolver, UserAction, hotkeyFormatter) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				button : "=",
				interaction : "=",
				showHotKeys : "=",
				keyBind : "=",
			},
			link : function(scope, element, attrs, controller) {
				scope.$watch('button', function(button) {
					if (button != undefined) {
						proxyObjectResolver.resolveProp(button, 'hotKeys', function(keys) {
							var kb = [];
							for (var i = 0; i < keys.length; i++) {
								kb.push(keys[i].keyString);
							}

							scope.keyDisplay = kb.join(' | ');

							Mousetrap.bind(kb, function() {
								scope.active = true;
								$timeout(function() {
									scope.active = false;
								}, 2000);
								if (scope.keyBind) {
									scope.callButton(scope.button.id);
									return false;
								}
							});
						});
					}
				});
			},
			controller : function($scope) {
				$scope.active = false;

				$scope.callButton = function(buttonId) {
					new UserAction({
						'trigger_id' : buttonId,
						'interaction_id' : $scope.interaction.id
					}).$save();
				}
			}
		};
	};

	return [ '$q', '$timeout', 'proxyObjectResolver', 'UserAction', 'hotkeyFormatter', ActionButton ];
});
