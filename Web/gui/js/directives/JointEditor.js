(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'js/services/proxyServices',
	                     'js/models/ServoInterface' 
	                     ];

	define(dependancies, function(angular) {

		var JointEditor = function(proxyObjectResolver, ServoInterface) {
			return {
				templateUrl : 'partials/action/joint.html',
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

					$scope.$watch('servo', function(servo) {
						proxyObjectResolver.resolveProp(servo, 'model');
					});

					var servoInt = null;
					var getInt = function() {
						if (servoInt == null) {
							servoInt = new ServoInterface({
								'id' : $scope.servo.id
							});
						}

						return servoInt;
					}

					$scope.removeJoint = function() {
						$scope.jointPosition.$delete(function() {
							$scope.jointPosition.unused = true;
							delete $scope.jointPosition.id;
						});
					};

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
						if ($scope.jointPosition != undefined) {
							var servoInt = getInt();
							servoInt.position = $scope
									.coalesce($scope.jointPosition.position, $scope.servo.defaultPosition, $scope.servo.model.defaultPosition);
							servoInt.speed = $scope.coalesce($scope.jointPosition.speed, $scope.servo.defaultSpeed, $scope.servo.model.defaultSpeed);

							if (!$scope.moving) {
								servoInt.$save(function() {
									$scope.moving = false;
								}, function() {
									$scope.moving = false;
								});
							}
						}
					};

					$scope.$watch('jointPosition.position', function() {
						if ($scope.connected) {
							$scope.writeToServo();
						}
					});
				},
			};
		};

		return [ 'proxyObjectResolver', 'ServoInterface', JointEditor ];
	});
}());
