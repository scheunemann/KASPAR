'use strict';

define(function(require) {
	var angular = require('angular');
	require('common/services/proxyServices');
	var template = require('text!./timeTriggerEditor.tpl.html');

	var TimeTriggerEditor = function(proxyObjectResolver) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				time : "=trigger",
				actions : "=",
				triggers : "=",
			},
			link : function(scope, iElement, iAttrs, controller) {
			},
			controller : function($scope) {
				$scope.$watch('time', function(time) {
					if(time != undefined) {
						proxyObjectResolver.resolveProp(time, 'action');
						proxyObjectResolver.resolveProp(time, 'trigger');
					}
				});

				$scope.addTriggers = function(triggers) {
					if ($scope.time.triggers === undefined) {
						$scope.time.triggers = [];
					}

					for (var i = 0; i < triggers.length; i++) {
						$scope.time.triggers.push(triggers[i]);
					}

					save();
				};

				var save = function() {
					var selfIndex = -1;
					if ($scope.time.id !== undefined) {
						for (var i = 0; i < $scope.time.triggers.length; i++) {
							if ($scope.time.triggers[i].id === $scope.time.id) {
								selfIndex = i;
								break;
							}
						}
					} else {
						selfIndex = $scope.time.triggers.indexOf($scope.time);
					}

					if (selfIndex >= 0) {
						$scope.time.triggers.splice(selfIndex, 1)
						$scope.time.selfRef = true;
						$scope.time.$save(function() {
							selfIndex = -1;
							for (var i = 0; i < $scope.time.triggers.length; i++) {
								if ($scope.time.triggers[i].id === $scope.time.id) {
									selfIndex = i;
									break;
								}
							}
							if (selfIndex < 0) {
								$scope.time.triggers.push($scope.time);
							}
						});
					} else {
						$scope.time.$save();
					}
				}

				$scope.removeTriggers = function(triggers) {
					for (var i = 0; i < triggers.length; i++) {
						$scope.time.triggers.splice($scope.time.triggers.indexOf(triggers[i]), 1);
					}

					save();
				};

			},
		};
	};

	return [ 'proxyObjectResolver', TimeTriggerEditor ];
});
