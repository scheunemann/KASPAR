(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'js/services/proxyServices', 
	                     'js/filters/filters', 
	                     'js/models/JointPosition', 
	                     'js/models/RobotInterface', 
	                     'js/models/ServoInterface'
	                     ];

	define(dependancies, function(angular) {

		var AdvancedPoseEditor = function($q, $rootScope, $filter, proxyObjectResolver, JointPosition, RobotInterface, ServoInterface) {
			return {
				templateUrl : 'partials/action/poseadvanced.html',
				restrict : 'E',
				scope : {
					pose : "=",
					robot : "=",
					connected : "=",
				},
				controller : function($scope) {
					$scope.$watch('pose', function() {
						proxyObjectResolver.resolveProp($scope.pose, 'jointPositions', function(result) {
							$scope.getGroups(result, $scope.robot);
						});
					});

					$scope.cometGet = function(data) {
						$scope.servoPositions = data;
						RobotInterface.get({
							'id' : $scope.robot.id,
							'timestamp' : data.timestamp
						}, $scope.cometGet);
					}

					$scope.$watch('robot', function() {
						if ($scope.robot != undefined) {
							proxyObjectResolver.resolveProp($scope.robot, 'servos', function(servos) {
								$scope.joints = [];
								for (var i = 0; i < servos.length; i++) {
									$scope.joints.push(servos[i].jointName);
								}
							});
						}

						$scope.getGroups($scope.pose.jointPositions, $scope.robot);
					});

					$scope.getJointNames = function(servos) {
						var names = [];
						var keys = {}
						if (servos != undefined) {
							for (var i = 0; i < servos.length; i++) {
								if (!keys.hasOwnProperty(servos[i].jointName)) {
									names.push(servos[i].jointName);
									names[servos[i].jointName] = 1;
								}
							}
						}

						return names;
					};

					$scope.getInteface = function(jointName) {
						if ($scope.robot != undefined && $scope.connected) {
							for ( var index in $scope.robot.servos) {
								if ($scope.robot.servos[index].jointName == jointName) { return ServoInterface({
									'id' : $scope.servo.id
								}); }
							}
						}

						return null;
					};

					var processGroup = function(servoGroup, positions) {
						var def = $q.defer();
						proxyObjectResolver.resolveProp(servoGroup, 'servos', function(servos) {
							var joints = [];
							var ids = [];
							for ( var servoIndex in servos) {
								var servo = servos[servoIndex];
								var posId = null;
								for ( var posIndex in positions) {
									if (positions[posIndex].jointName == servo.jointName) {
										posId = positions[posIndex].id;
										joints.push(positions[posIndex]);
										break;
									}
								}

								if (posId == null) {
									joints.push(new JointPosition({
										'position' : servo.defaultPosition,
										'speed' : servo.defaultSpeed,
										'jointName' : servo.jointName,
										'unused' : true,
										'pose' : $scope.pose
									}));
								} else {
									ids.push(posId);
								}
							}

							var result = null;
							if (joints.length > 0) {
								result = [ ids, {
									'name' : servoGroup.name,
									'rows' : getRows(joints)
								} ];
							}

							def.resolve(result);
						});

						return def.promise;
					};

					$scope.getGroups = function(jointPositions, robot) {
						if (jointPositions != undefined) {
							var posCopy = [];
							for ( var index in jointPositions) {
								posCopy.push(jointPositions[index]);
							}

							var groups = [];
							var def = $q.defer();
							if (robot == undefined) {
								$scope.groups = [ {
									'name' : 'Pose Joints',
									'rows' : getRows(posCopy)
								} ];
							} else {
								proxyObjectResolver.resolveProp(robot, 'servoGroups', function(servoGroups) {
									var promises = [];
									for (var index = 0; index < servoGroups.length; index++) {
										promises.push(processGroup(servoGroups[index], posCopy));
									}

									$q.all(promises).then(function(res) {
										var groups = [];
										for (var index = 0; index < res.length; index++) {
											if (res[index] != null) {
												groups.push(res[index][1]);
												for (var idIdx = 0; idIdx < res[index][0].length; idIdx++) {
													for (var posIdx = 0; posIdx < posCopy.length; posIdx++) {
														if (posCopy[posIdx].id == res[index][0][idIdx]) {
															var elm = posCopy.splice(posIdx, 1);
															break;
														}
													}
												}
											}
										}

										if (posCopy.length > 0) {
											groups.push({
												'name' : 'No Group',
												'rows' : getRows(posCopy)
											});
										}

										$scope.groups = groups;
										$rootScope.$$phase || $rootScope.$apply();
									});
								});

							}
						}
					};

					var getRows = function(positions) {
						return positions;
					}

					$scope.getServo = function(jointName, servos) {
						if (servos != undefined) {
							var servo = null;
							for (var i = 0; i < servos.length; i++) {
								if (servos[i].jointName == jointName) {
									servo = servos[i];
									break;
								}
							}

							return servo;
						}
					}

					$scope.getPosition = function(jointName, positions) {
						if (positions != undefined) {
							var position = null;
							for (var i = 0; i < positions.length; i++) {
								if (positions[i].jointName == jointName) {
									position = positions[i];
									break;
								}
							}

							return position;
						}
					};
				},
			};
		};

		return [ '$q', '$rootScope', '$filter', 'proxyObjectResolver', 'JointPosition', 'RobotInterface', 'ServoInterface', AdvancedPoseEditor ];
	});
}());
