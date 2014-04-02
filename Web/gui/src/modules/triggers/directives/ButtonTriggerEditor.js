'use strict';

define(function(require) {
	var angular = require('angular');
	require('triggers/models');
	var template = require('text!./buttonTriggerEditor.tpl.html');

	var ButtonTriggerEditor = function(ButtonHotkey) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				button : "=trigger",
				actions : "=",
				triggers : "=",
			},
			controller : function($scope) {
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

	return [ 'ButtonHotkey', ButtonTriggerEditor ];
});
