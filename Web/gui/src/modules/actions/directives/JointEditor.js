'use strict';

define(function(require) {
	var angular = require('angular');
	require('robots/services/interfaceServices');
	var template = require('text!./jointEditor.tpl.html');

	var JointEditor = function(robotInterface, JointPosition, ServoModel, language, $timeout) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				jointNames : "=",
				jointPosition : "=",
				servo : "=",
				servoPositions : "=",
				groupPoseable : "=?poseable",
				advanced : "=?",
			},
			controller : function($scope) {
				$scope.language = language.getText();
				if ($scope.advanced === undefined) {
					$scope.advanced = !($scope.connected || false);
				}

				// One way binding
				$scope.poseable = false;
				$scope.$watch('groupPoseable', function(value) {
					$scope.poseable = value;
				});

				var checkPositions = function() {
					if ($scope.jointPosition) {
						if ($scope.jointPosition.position === undefined || $scope.jointPosition.position === null) {
							if ($scope.servo !== undefined && $scope.servo !== null && $scope.servo.defaultPosition !== undefined
									&& $scope.servo.defaultPosition !== null) {
								$scope.jointPosition.position = $scope.servo.defaultPosition;
							} else if ($scope.servoModel !== undefined && $scope.servoModel !== null && $scope.servoModel.defaultPosition !== undefined
									&& $scope.servoModel.defaultPosition !== null) {
								$scope.jointPosition.position = $scope.servoModel.defaultPosition;
							} else {
								$scope.jointPosition.position = 0;
							}
						}

						if ($scope.jointPosition.speed === undefined || $scope.jointPosition.speed === null) {
							if ($scope.servo !== undefined && $scope.servo !== null && $scope.servo.defaultSpeed !== undefined
									&& $scope.servo.defaultSpeed !== null) {
								$scope.jointPosition.speed = $scope.servo.defaultSpeed;
							} else if ($scope.servoModel !== undefined && $scope.servoModel !== null && $scope.servoModel.defaultPosition !== undefined
									&& $scope.servoModel.defaultSpeed !== null) {
								$scope.jointPosition.speed = $scope.servoModel.defaultSpeed;
							} else {
								$scope.jointPosition.speed = 100;
							}
						}
					}
				};

				$scope.$watch('servo', checkPositions);
				$scope.$watch('jointPosition', checkPositions);

				$scope.$watch('jointPosition.jointName', function(jointName) {
					$scope.servoInt = robotInterface.getServo(jointName);
				});

				$scope.removeJoint = function() {
					if($scope.jointPosition.isNew) {
						delete $scope.jointPosition.isNew;
					}
					if ($scope.jointPosition.id) {
						$scope.jointPosition.isDeleted = true;
					}
					$scope.jointForm.$setPristine();
				};

				$scope.$watch('servo.model_id', function(modelId) {
					if (modelId !== undefined) {
						$scope.servoModel = ServoModel.get({
							id : modelId,
						});
					}
				});

				$scope.coalesce = function() {
					for (var i = 0; i < arguments.length; i++) {
						if (arguments[i] !== undefined && arguments[i] !== null) { return arguments[i]; }
					}

					return null;
				};

				var writeToServo = function(force) {
					if($scope.jointPosition.isDeleted) {
						delete $scope.jointPosition.isDeleted;
					}
					if (!$scope.jointPosition.id) {
						$scope.jointPosition.isNew = true;
					}
					if (!$scope.servoInt) {
						console.log("No interface for " + $scope.jointPosition);
					}
					if (force || $scope.advanced) {
						$scope.writeJoint($scope.jointPosition, $scope.servoInt);
					}
				};

				$scope.writeJoint = function(jointPosition, servoInt) {
					if (jointPosition && servoInt && jointPosition.position != servoInt.position) {
						$timeout(function() {
							//console.log('updating servo position from joint. ' + jointPosition.jointName + ':' + servoInt.position + "->" + jointPosition.position);
							servoInt.position = jointPosition.position;
							servoInt.speed = jointPosition.speed;
							servoInt.poseable = $scope.poseable;
						});
					}
				};

				$scope.$watch('servoInt.$actual.position', function(newValue, oldValue) {
					if (!$scope.advanced && $scope.jointPosition) {
						console.log('updating joint position from servo' + $scope.servo.jointName);
						$scope.jointPosition.position = newValue;
					}
				});

				$scope.$watch('jointPosition', function(newValue, oldValue) {
					if(newValue.id) {
						writeToServo();
					}
				});
				
				$scope.$watch('jointPosition.position', function(newValue, oldValue) {
					$scope.writeJoint($scope.jointPosition, $scope.servoInt);
				});

				$scope.$watch('poseable', function(poseable) {
					if ($scope.servoInt) {
						if(poseable) {
							$scope.servoInt.position = $scope.servoInt.$actual.position;
						}

						$scope.servoInt.poseable = poseable;
					}
				});
			},
		};
	};

	return [ 'robotInterface', 'JointPosition', 'ServoModel', 'language', '$timeout', JointEditor ];
});
