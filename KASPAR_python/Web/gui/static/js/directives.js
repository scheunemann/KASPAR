'use strict';

/* Directives */


angular.module('kasparGUI.directives', [ 'proxyService']).
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
		        },
		        link: function(scope, iElement, iAttrs, controller) {
		        	scope.$watch('type', function(newType) {
		        		if (newType != "" && newType != undefined) {
		        			iElement.html('<' + newType + '-editor action="action"></' + newType + '-editor>');
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
		        			new JointPosition({jointName:'HEAD_ROT', angle:188}),
		        			new JointPosition({jointName:'HEAD_VERT', angle:188}),
		        			new JointPosition({jointName:'HEAD_TLT', angle:188}),
		        	];
		        }
  	  };

	  return def;
  }])
  .directive('advancedPoseEditor', ['$q', '$filter', 'proxyObjectResolver', function($q, $filter, proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/action/poseadvanced.html',
			  restrict: 'E',
			  scope: {
				  pose: "=",
				  robot: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  
				  $scope.$watch('robot', function() {
					  if($scope.robot != undefined) {
						  proxyObjectResolver.resolveProp($scope.robot, 'servoGroups');
						  proxyObjectResolver.resolveProp($scope.robot, 'servos');
						  $scope.robot.servoGroups.then(function(groups) {
							  for(var i = 0; i < groups.length; i++) {
								  proxyObjectResolver.resolveProp(groups[i], 'servos');
							  }
						  });
					  }
				  });
				  
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
				  }
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
				  $scope.$watch('servo', function() {
					  if($scope.servo != undefined) {
						  if(angular.isArray($scope.servo)) {
							  $scope.servo = $scope.servo[0];
						  }
						  
						  proxyObjectResolver.resolveProp($scope.servo, 'type');
					  }
				  });
			  },
	  };
	  
	  return def;
  }])
;
