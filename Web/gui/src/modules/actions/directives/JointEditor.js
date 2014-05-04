'use strict';

define(function(require) {
	var angular = require('angular');
	require('robots/services/interfaceServices');
	var template = require('text!./jointEditor.tpl.html');

	var JointEditor = function(robotInterface, JointPosition, ServoModel, language) {
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
				$scope.language = language.getText();

				var checkPositions = function() {
					if($scope.jointPosition !== undefined) {
						if($scope.jointPosition.position === undefined || $scope.jointPosition.position === null) {
							if($scope.servo !== undefined && $scope.servo !== null &&
								$scope.servo.defaultPosition !== undefined && $scope.servo.defaultPosition !== null) {
								$scope.jointPosition.position = $scope.servo.defaultPosition;	
							} else if($scope.servoModel !== undefined && $scope.servoModel !== null && 
									$scope.servoModel.defaultPosition !== undefined && $scope.servoModel.defaultPosition !== null) {
								$scope.jointPosition.position = $scope.servoModel.defaultPosition;
							} else {
								$scope.jointPosition.position = 0;
							}
						}
						
						if($scope.jointPosition.speed === undefined || $scope.jointPosition.speed === null) {
							if($scope.servo !== undefined && $scope.servo !== null &&
								$scope.servo.defaultSpeed !== undefined && $scope.servo.defaultSpeed !== null) {
								$scope.jointPosition.speed = $scope.servo.defaultSpeed;	
							} else if($scope.servoModel !== undefined && $scope.servoModel !== null && 
									$scope.servoModel.defaultPosition !== undefined && $scope.servoModel.defaultSpeed !== null) {
								$scope.jointPosition.speed = $scope.servoModel.defaultSpeed;
							} else {
								$scope.jointPosition.speed = 100;
							}
						}
					}
				};
				
				$scope.$watch('servo', checkPositions);
				$scope.$watch('jointPosition', checkPositions);
				
				$scope.$watch('servo.jointName', function(jointName) {
					$scope.servoInt = robotInterface.getServo(jointName);
				});

				$scope.removeJoint = function() {
					var promise;
					if ($scope.jointPosition.$delete === undefined) {
						promise = JointPosition.delete({id: $scope.jointPosition.id});
					} else {
						promise = $scope.jointPosition.$delete();
					}
					promise.then(function() {
						delete $scope.jointPosition.id;
					});
				};

				$scope.$watch('servo.model_id', function(modelId) {
					if (modelId !== undefined) {
						$scope.servoModel = ServoModel.get({
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
						if (arguments[i] !== undefined && arguments[i] !== null) { return arguments[i]; }
					}

					return null;
				};

				$scope.writeToServo = function() {
					if ($scope.jointPosition !== undefined && $scope.servoInt !== undefined) {
						$scope.servoInt.speed = $scope.jointPosition.speed;
						$scope.servoInt.position = $scope.jointPosition.position;
					}
				};

				$scope.$watch('jointPosition.position', function() {
					$scope.writeToServo();
				});
			},
		};
	};

	return [ 'robotInterface', 'JointPosition', 'ServoModel', 'language', JointEditor ];
});
