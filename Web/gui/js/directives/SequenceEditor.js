(function() {
	'use strict';
	
	var dependancies = [ 
	                     'angular', 
	                     'js/services/proxyServices',
	                     'js/models/OrderedAction' 
	                     ];

	define(dependancies, function(angular, proxyServices, OrderedAction) {

		var SequenceEditor = function(proxyObjectResolver, OrderedAction) {
			return {
				templateUrl : 'partials/action/sequence.html',
				restrict : 'E',
				scope : {
					sequence : "=action",
					actions : "=",
				},
				controller : function($scope) {
					$scope.$watch('sequence', function(sequence) {
						proxyObjectResolver.resolveProp(sequence, 'ordered_actions', function(oactions) {
							if (oactions != undefined) {
								for (var i = 0; i < oactions.length; i++) {
									proxyObjectResolver.resolveProp(oactions[i], 'action');
								}
							}
						});
					});

					$scope.moveActions = function(oactions, change) {
						// Change == 1
						// oactions.length = 3
						// ordered_actions.lenght = 7
						// for action in oactions:
						// order += change
						// if exists(ordered_actions.order)
						// ordered_actions.order -= change
						/*
						 * [3, 5, 6] +1 1 => 1 2 => 2 3 => 4 (+1) 4 => 3 (-1) 5 =>
						 * 6 (+1) 6 => 7 (+1) 7 => 5 (-2)
						 * 
						 */

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

						//					
						// for(var i = 0; i <
						// $scope.sequence.ordered_actions.length; i++) {
						// $scope.sequence.ordered_actions[i].$save();
						// proxyObjectResolver.resolveProp($scope.sequence.ordered_actions[i],
						// 'action');
						// }
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
							// if (oactions[i].id != undefined) {
							// oactions[i].$delete();
							// }
						}

						$scope.saveAll();
					};

					$scope.getActions = function(ordered_actions) {
						var ret = [];
						if (ordered_actions != undefined) {
							for (var i = 0; i < ordered_actions.length; i++) {
								ret.push(ordered_actions[i].action);
							}
						}
						return ret;
					}
				},
			};
		};

		return [ 'proxyObjectResolver', 'OrderedAction', SequenceEditor ];
	});
}());
