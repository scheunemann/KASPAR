'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./groupEditor.tpl.html');

	var GroupEditor = function(language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				group : "=action",
				actions : "=",
			},
			controller : function($scope) {
				$scope.language = language.getText();
				$scope.toRemove = [];
				$scope.toAdd = [];

				$scope.$watch('group', function(group) {
					if (group !== undefined && group.actions === undefined) {
						group.actions = [];
					}
				});

				$scope.$watch('actions', function(actions) {
					if (actions !== undefined && actions !== null) {
						$scope.groupedActions = _.groupBy(actions, 'type');
					}
				});

				$scope.addActions = function(actions) {
					for (var i = 0; i < actions.length; i++) {
						$scope.group.actions.push({
							name : actions[i].name,
							id : actions[i].id
						});
					}

					for (var j = 0; j < $scope.group.actions.length; j++) {
						$scope.group.actions[j].speedModifier = undefined;
					}

					$scope.group.$save();
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
					if (action && $scope.group && (action == $scope.group || action.id == $scope.group.id)) { return; }

					var index = $scope.toAdd.indexOf(action);
					if (index >= 0) {
						$scope.toAdd.splice(index, 1);
					} else {
						$scope.toAdd.push(action);
					}
				};

				$scope.removeActions = function(actions) {
					for (var i = 0; i < actions.length; i++) {
						$scope.group.actions.splice($scope.group.actions.indexOf(actions[i]), 1);
					}

					$scope.group.$save();
				};

				$scope.save = function() {
					// Clean objects
					for (var j = 0; j < $scope.group.actions.length; j++) {
						$scope.group.actions[j].action = undefined;
						$scope.group.actions[j].group = undefined;
					}

					$scope.group.$save();
				};
				
				$scope.saveAs = function() {
					var newGroup = new Action({
						'type' : 'GroupAction',
						'name' : $scope.group.name + ' - Copy',
						'actions' : $scope.group.actions.slice(0)
					});

					$scope.group = newGroup;
					$scope.save();
				};
			},
		};
	};

	return [ 'language', GroupEditor ];
});
