'use strict';

define(function(require) {
	var angular = require('angular');
	var _ = require('underscore');
	var template = require('text!./sequenceEditor.tpl.html');
	require('actions/models');

	var SequenceEditor = function(SequenceOrder, language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				sequence : "=action",
				actions : "=",
			},
			controller : function($scope) {
				$scope.language = language.getText();
				$scope.toRemove = [];
				$scope.toAdd = [];

				$scope.$watch('actions', function(actions) {
					if (actions !== undefined && actions !== null) {
						$scope.groupedActions = _.groupBy(actions, 'type');
					}
				});

				$scope.$watch('sequence', function(sequence) {
					if (sequence.actions === undefined) {
						sequence.actions = [];
					}
				});

				$scope.getName = function(actionId) {
					if ($scope.actions !== undefined) {
						for (var i = 0; i < $scope.actions.length; i++) {
							if ($scope.actions[i].id == actionId) { return $scope.actions[i].name; }
						}
					}

					return "Unknown action";
				};

				$scope.getType = function(actionId) {
					if ($scope.actions !== undefined) {
						for (var i = 0; i < $scope.actions.length; i++) {
							if ($scope.actions[i].id == actionId) { return $scope.actions[i].type; }
						}
					}

					return "Unknown action";
				};

				$scope.moveActions = function(oactions, change) {
					if (oactions !== undefined && oactions.length > 0) {
						if (change > 0) {
							for (var i = oactions.length - 1; i >= 0; i--) {
								var oldIndex = $scope.sequence.actions.indexOf(oactions[i]);
								var newIndex = oldIndex + change;
								if (newIndex > $scope.sequence.actions.length - 1) {
									newIndex = $scope.sequence.actions.length - 1;
								}

								// Prevent swapping order with elements in
								// oactions list
								if (oactions.indexOf($scope.sequence.actions[newIndex]) < 0) {
									var element = $scope.sequence.actions.splice(oldIndex, 1)[0];
									$scope.sequence.actions.splice(newIndex, 0, element);
								}
							}
						} else {
							for (var i = 0; i < oactions.length; i++) {
								var oldIndex = $scope.sequence.actions.indexOf(oactions[i]);
								var newIndex = oldIndex + change;
								if (newIndex < 0) {
									newIndex = 0;
								}
								if (oactions.indexOf($scope.sequence.actions[newIndex]) < 0) {
									var element = $scope.sequence.actions.splice(oldIndex, 1)[0];
									$scope.sequence.actions.splice(newIndex, 0, element);
								}
							}
						}
					}
				};

				$scope.fixOrder = function() {
					for (var i = 0; i < $scope.sequence.actions.length; i++) {
						$scope.sequence.actions[i].order = i;
					}
				};

				$scope.toggleSelect = function(action) {
					var index = $scope.toRemove.indexOf(action);
					if (index >= 0) {
						$scope.toRemove.splice(index, 1);
					} else {
						$scope.toRemove.push(action);
					}
				};

				$scope.toggleAddSelect = function(action) {
					if (action && $scope.sequence && (action == $scope.sequence || action.id == $scope.sequence.id)) { return; }

					var index = $scope.toAdd.indexOf(action);
					if (index >= 0) {
						$scope.toAdd.splice(index, 1);
					} else {
						$scope.toAdd.push(action);
					}
				};

				$scope.save = function() {
					// Only send _id properties since flask-restless has issues
					// with polymorphic values
					for (var j = 0; j < $scope.sequence.actions.length; j++) {
						$scope.sequence.actions[j].action = undefined;
						$scope.sequence.actions[j].sequence = undefined;
					}

					$scope.sequence.$save();
				};

				$scope.saveAs = function() {
					var actions = _.map($scope.sequence.actions, function(sa) {
						return new SequenceOrder({
							'order' : sa.order,
							'action_id' : sa.action_id
						});
					});

					var newSequence = new Action({
						'type' : 'SequenceAction',
						'name' : $scope.sequence.name + ' - Copy',
						'actions' : actions
					});

					$scope.sequence = newSequence;
					$scope.save();
				};

				$scope.addActions = function(actions) {
					for (var i = 0; i < actions.length; i++) {
						var oa = new SequenceOrder({
							'order' : $scope.sequence.actions.length,
							'sequence_id' : $scope.sequence.id,
							'action_id' : actions[i].id
						});
						$scope.sequence.actions.push(oa);
					}
				};

				$scope.removeActions = function(oactions) {
					for (var i = 0; i < oactions.length; i++) {
						$scope.sequence.actions.splice($scope.sequence.actions.indexOf(oactions[i]), 1);
					}
				};
			},
		};
	};

	return [ 'SequenceOrder', 'language', SequenceEditor ];
});
