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
  .directive('advancedPoseEditor', ['$q', '$filter', function($q, $filter) {
	  var def = {
			  templateUrl: 'static/partials/action/poseadvanced.html',
			  restrict: 'E',
			  scope: {
				  pose: "=",
				  servos: "=",
			  },
			  controller: function($scope) {
				  $scope.$watch('servos', function() {
					  $scope.jointNames = $q.when($scope.servos).then(function(servos) { 
						  if (servos == undefined) {
							  return [];
						  }
						  var names = [];
						  for(var i = 0; i < servos.length; i++) {
							  names.push(servos[i].jointName);
						  }
						  
						  return names;
					  });
				  });
				  
				  $scope.getServo = function(servos, jointName) {
					  if(servos != undefined) {
						  for(var i = 0; i < servos.length; i++) {
							  if(servos[i].jointName == jointName) {
								  	return servos[i];
							  }
						  }
						  
						  return null;
					  }
				  };
			  },
	  };
	  
	  return def;
  }])
  .directive('testEditor', function() {
	  var def = {
			  template: "<div>Val:{{value}}</div>",
			  restrict: 'E',
			  scope: {
				  value: "=",
			  }
	  }
  })
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
