'use strict';

/* Directives */


angular.module('kasparGUI.directives', [ 'proxyService', 'dataModels', 'kasparGUI.filters']).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('actionEditor', ['$compile', function($compile) {
		var def = {
				restrict: 'E',
				scope: {
					type: "=",
		            action: "=",
		            actions: "=",
		        },
		        link: function(scope, iElement, iAttrs, controller) {
		        	scope.$watch('type', function(newType) {
		        		if (newType != "" && newType != undefined) {
		        			if(newType.toLowerCase() == "group" || newType.toLowerCase() == "sequence") {
			        			iElement.html('<' + newType + '-editor action="action" actions="actions"></' + newType + '-editor>');
		        			} else {
			        			iElement.html('<' + newType + '-editor action="action"></' + newType + '-editor>');
		        			}
				        	$compile(iElement.contents())(scope);
		        		} else {
		        			iElement.html('');
		        			$compile(iElement.contents())(scope);
		        		}
		        	});
		        },
			  };

	return def;
  }])
  .directive('poseEditor', ['JointPosition', function(JointPosition) {
	  var def = {
				templateUrl: 'static/partials/action/pose.html',
				restrict: 'E',
				scope: {
		            pose: "=action",
		        },
		        controller: function($scope) {
		        	$scope.pose.positions = [
		        			new JointPosition({jointName:'HEAD_ROT', angle:188, speed:100}),
		        			new JointPosition({jointName:'HEAD_VERT', angle:188}),
		        			new JointPosition({jointName:'HEAD_TLT', angle:188}),
		        			new JointPosition({jointName:'EYES_LR', angle:188}),
		        			new JointPosition({jointName:'EYES_UD', angle:188}),
		        			new JointPosition({jointName:'MOUTH_OPEN', angle:188, speed:200}),
		        			new JointPosition({jointName:'MOUTH_SMILE', angle:188}),
		        			new JointPosition({jointName:'EYELIDS', angle:188}),
		        			new JointPosition({jointName:'ARM_L_1', angle:188}),
		        			new JointPosition({jointName:'ARM_L_2', angle:188}),
		        			new JointPosition({jointName:'ARM_L_3', angle:188}),
		        			new JointPosition({jointName:'ARM_L_4', angle:188}),
		        			new JointPosition({jointName:'ARM_R_1', angle:188}),
		        			new JointPosition({jointName:'ARM_R_2', angle:188}),
		        			new JointPosition({jointName:'ARM_R_3', angle:188}),
		        			new JointPosition({jointName:'ARM_R_4', angle:188}),
		        	];
		        }
  	  };

	  return def;
  }])
  .directive('advancedPoseEditor', ['$q', '$filter', 'proxyObjectResolver', 'JointPosition', function($q, $filter, proxyObjectResolver, JointPosition) {
	  var def = {
			  templateUrl: 'static/partials/action/poseadvanced.html',
			  restrict: 'E',
			  scope: {
				  pose: "=",
				  robot: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  $scope.joints = ['HEAD_ROT','HEAD_VERT', 'HEAD_TLT', 'EYES_LR', 'EYES_UD', 'MOUTH_OPEN', 'MOUTH_SMILE',
				                   'EYELIDS', 'ARM_L_1', 'ARM_L_2', 'ARM_L_3', 'ARM_L_4', 'ARM_R_1', 'ARM_R_2', 'ARM_R_3', 'ARM_R_4'];
			  
				  $scope.getJointNames = function(servos) {
					  var names = [];
					  var keys = {}
					  if(servos != undefined) {
						  for(var i = 0; i < servos.length; i++) {
							  if(!keys.hasOwnProperty(servos[i].jointName)) {
								  names.push(servos[i].jointName);
								  names[servos[i].jointName] = 1;
							  }
						  }
					  }
					  
					  return names;
				  };
				  
				  $scope.getPosition = function(positions, servo) {
					  if(positions != undefined) {
						  var position = null;
						  for(var i = 0; i < positions.length; i++) {
							  if(positions[i].jointName == servo.jointName) {
								  position = positions[i];
								  break;
							  }
						  }
						  
						  if(position == null) {
							  position = new JointPosition({jointName:servo.jointName, angle:100});
							  positions.push(position);
						  }
						  
						  return position;
					  }
				  };
			  },
	  };
	  
	  return def;
  }])
  .directive('jointEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/action/joint.html',
			  restrict: 'E',
			  scope: {
				  jointNames: "=",
				  jointPosition: "=",
				  servo: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
			  },
	  };
	  
	  return def;
  }])
  .directive('soundEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/action/sound.html',
			  restrict: 'E',
			  scope: {
				  sound: "=action",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
			  },
	  };
	  
	  return def;
  }])
  .directive('groupEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/action/group.html',
			  restrict: 'E',
			  scope: {
				  group: "=action",
				  actions: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  
				  $scope.addActions = function(actions) {
					  if($scope.group.actions === undefined) {
						  $scope.group.actions = []
					  }

					  for (var i = 0; i < actions.length; i++) {
						  $scope.group.actions.push(actions[i]);
					  }
				  };
				  
				  $scope.removeActions = function(actions) {
					  for (var i = 0; i < actions.length; i++) {
						  $scope.group.actions.splice($scope.group.actions.indexOf(actions[i]), 1);
					  }
				  };
			  },
	  };
	  
	  return def;
  }])
  .directive('sequenceEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/action/sequence.html',
			  restrict: 'E',
			  scope: {
				  sequence: "=action",
				  actions: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
			  },
	  };
	  
	  return def;
  }])
;
