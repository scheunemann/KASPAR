'use strict';

define(function(require) {
	var angular = require('angular');
	require('robots/services/interfaceServices');
	var template = require('text!./jointEditor.tpl.html');

	var JointEditor = function(robotInterface, JointPosition, ServoModel) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				jointNames : "=",
				jointPosition : "=",
				servo : "=",
				servoPositions : "=",
				connected : "=",
			},
			controller : function($scope) {
				$scope.moving = false;

				$scope.$watch('jointPosition', function(jointPosition) {
					if (jointPosition != undefined) {
						if (typeof jointPosition.$save != 'function') {
							$scope.jointPosition = JointPosition.get({
								id : jointPosition.id
							});
						}
					}
				});

				$scope.$watch('servo.jointName', function(jointName) {
					$scope.servoInt = robotInterface.getServo(jointName);
				});

				$scope.removeJoint = function() {
					$scope.jointPosition.$delete(function() {
						$scope.jointPosition.unused = true;
						delete $scope.jointPosition.id;
					});
				};

				$scope.$watch('servo.model_id', function(modelId) {
					if (modelId != undefined) {
						$scope.servoModel = new ServoModel({
							id : modelId,
						});
					}
				});

				$scope.$watch('connected', function(value) {
					if (value) {
						$scope.writeToServo();
					}
				});

				$scope.coalesce = function() {
					for (var i = 0; i < arguments.length; i++) {
						if (arguments[i] != undefined && arguments[i] != null) { return arguments[i]; }
					}

					return null;
				}

				$scope.writeToServo = function() {
					if ($scope.jointPosition != undefined && $scope.servoInt != undefined) {
						$scope.servoInt.speed = $scope.coalesce($scope.jointPosition.speed, $scope.coalesce($scope.servo, $scope.servoModel, {
							defaultSpeed : 100
						}).defaultSpeed);
						$scope.servoInt.position = $scope.coalesce($scope.jointPosition.position, $scope.coalesce($scope.servo, $scope.servoModel, {
							defaultPosition : 0
						}).defaultPosition);
					}
				};

				$scope.$watch('jointPosition.position', function() {
					$scope.writeToServo();
				});
			},
		};
	};

	return [ 'robotInterface', 'JointPosition', 'ServoModel', JointEditor ];
});
