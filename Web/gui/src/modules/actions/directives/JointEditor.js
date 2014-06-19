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
				groupPoseable: "=?poseable",
				advanced: "=?",
			},
			controller : function($scope) {
				$scope.language = language.getText();
				if ($scope.advanced === undefined) {
					$scope.advanced = !($scope.connected || false);
				}
				
				//One way binding
				$scope.poseable = false;
				$scope.$watch('groupPoseable', function(value) {
					$scope.poseable = value;
				});
				
				var checkPositions = function() {
					if($scope.jointPosition) {
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
						promise = JointPosition.delete({id: $scope.jointPosition.id}).$promise;
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

				var writeToServo = function() {
					if ($scope.jointPosition && $scope.servoInt && $scope.advanced) {
						$scope.servoInt.speed = $scope.jointPosition.speed;
						$scope.servoInt.position = $scope.jointPosition.position;
						$scope.servoInt.poseable = $scope.poseable;
					}
				};

				$scope.$watch('servoInt.actual.position', function(value) {
					if(!$scope.advanced && $scope.jointPosition) {
						$scope.jointPosition.position = value;
					}
				});
								
				$scope.$watch('jointPosition.position', writeToServo);
				$scope.$watch('poseable', function(poseable) {
					if($scope.servoInt) {
						$scope.servoInt.position = $scope.servoInt.actual.position;
						$scope.servoInt.poseable = poseable;
					}
				});
			},
		};
	};

	return [ 'robotInterface', 'JointPosition', 'ServoModel', 'language', JointEditor ];
});
