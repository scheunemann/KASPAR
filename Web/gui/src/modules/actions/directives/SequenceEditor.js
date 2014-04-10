'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./sequenceEditor.tpl.html');
	require('actions/models');

	var SequenceEditor = function(OrderedAction) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				sequence : "=action",
				actions : "=",
			},
			controller : function($scope) {
				$scope.getName = function(actionId) {
					if($scope.actions != undefined) {
						for(var i = 0; i < $scope.actions.length; i++) {
							if($scope.actions[i].id == actionId) {
								return $scope.actions[i].name;
							}
						}
					}
					
					return "Unknown action";
				}
				
				$scope.moveActions = function(oactions, change) {
					// Change == 1
					// oactions.length = 3
					// ordered_actions.lenght = 7
					// for action in oactions:
					// order += change
					// if exists(ordered_actions.order)
					// ordered_actions.order -= change
					if (oactions != undefined && oactions.length > 0) {
						for (var i = 0; i < oactions.length; i++) {
							oactions[i].order += change;
							if (oactions[i].order < 0) {
								oactions[i].order = 0;
							}

							for (var j = 0; j < $scope.sequence.ordered_actions.length; j++) {
								var test = $scope.sequence.ordered_actions[j];
								if (test != oactions[i] && test.order == oactions[i].order) {
									test.order -= change;
									break;
								}
							}
						}

						$scope.saveAll();
					}
				}

				$scope.saveAll = function() {
					// Collapse gaps and fix duplicates
					for (var i = 0; i < $scope.sequence.ordered_actions.length;) {
						var left = $scope.sequence.ordered_actions[i];
						var next = false;

						for (var j = 0; j < $scope.sequence.ordered_actions.length; j++) {
							var right = $scope.sequence.ordered_actions[j];
							if (left != right) {
								if (left.order == right.order) {
									right.order += 1
								} else if (left.order - 1 == right.order) {
									next = true;
								}
							}
						}

						if (next || left.order == 0) {
							i++;
						} else {
							left.order -= 1;
						}
					}

					$scope.sequence.$save();
				}

				$scope.addActions = function(actions) {
					if ($scope.sequence.ordered_actions === undefined) {
						$scope.sequence.ordered_actions = []
					}

					for (var i = 0; i < actions.length; i++) {
						var oa = new OrderedAction();
						oa.order = oactions.length;
						oa.action = actions[i];
						$scope.sequence.ordered_actions[i].push(oa);
					}

					$scope.saveAll();
				};

				$scope.removeActions = function(oactions) {
					for (var i = 0; i < oactions.length; i++) {
						$scope.sequence.ordered_actions.splice($scope.sequence.ordered_actions.indexOf(oactions[i]), 1);
					}

					$scope.saveAll();
				};
			},
		};
	};

	return [ 'OrderedAction', SequenceEditor ];
});