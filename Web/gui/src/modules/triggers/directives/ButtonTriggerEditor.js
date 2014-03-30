'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	require('triggers/models');
	var template = require('text!./buttonTriggerEditor.tpl.html');

	var ButtonTriggerEditor = function(proxyObjectResolver, ButtonHotkey) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				button : "=trigger",
				actions : "=",
				triggers : "=",
			},
			controller : function($scope) {
				$scope.$watch('button', function(button) {
					proxyObjectResolver.resolveProp(button, 'hotKeys');
				});

				$scope.addButton = function() {
					if ($scope.button.hotKeys == undefined) {
						$scope.button.hotKeys = [];
					}

					$scope.button.hotKeys.push(new ButtonHotkey({
						'trigger_id' : $scope.button.id
					}));
				}
			},
		};
	};

	return [ 'proxyObjectResolver', 'ButtonHotkey', ButtonTriggerEditor ];
});
