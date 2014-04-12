'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/displayServices');
	require('actions/models');
	var template = require('text!./actionButton.tpl.html');

	var ActionButton = function($q, $timeout, UserAction, hotkeyFormatter) {
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
			},
			controller : function($scope) {
				$scope.active = false;
				var keyBinds = null;

				$scope.$watch('button', function(newValue, oldValue) {
					if (newValue != undefined) {
						var kb = [];
						for (var i = 0; i < $scope.button.hotKeys.length; i++) {
							kb.push($scope.button.hotKeys[i].keyString);
						}

						$scope.keyDisplay = kb.join(' | ');
						if (keyBinds != null) {
							Mousetrap.unbind(keyBinds);
						}

						keyBinds = kb;

						Mousetrap.bind(keyBinds, function() {
							$scope.active = true;
							$timeout(function() {
								$scope.active = false;
							}, 2000);
							if ($scope.keyBind) {
								$scope.callButton($scope.button.id);
								return false;
							}
						});
					}
				});

				$scope.callButton = function(buttonId) {
					new UserAction({
						'trigger_id' : buttonId,
						'interaction_id' : $scope.interaction.id
					}).$save();
				}
			}
		};
	};

	return [ '$q', '$timeout', 'UserAction', 'hotkeyFormatter', ActionButton ];
});
