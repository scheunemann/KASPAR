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
		        	})
		        },
			  };

	return def;
  }])
  .directive('poseEditor', function() {
	  var def = {
				templateUrl: 'static/partials/action/pose.html',
				restrict: 'E',
				scope: {
		            pose: "=action",
		        },
		        controller: function($scope) {
		        }
  	  };

	  return def;
  })
  .directive('advancedPoseEditor', [ 'JointPosition', function(JointPosition) {
	  var def = {
			  templateUrl: 'static/partials/action/poseadvanced.html',
			  restrict: 'E',
			  scope: {
				  pose: "=",
				  servos: "=",
			  },
			  controller: function($scope) {
				  $scope.pose.positions = [];
				  for(var i = 0; i < $scope.servos.length; i++) {
					  $scope.pose.positions.push(new JointPosition({jointName:$scope.servos[i].jointName}));
				  }
			  },
	  };
	  
	  return def;
  }])
  .directive('jointEditor', [ 'proxyObjectResolver', function() {
	var def = {
				templateUrl: 'static/partials/action/joint.html',
				restrict: 'E',
				scope: {
		            jointPosition: "=",
		            servo: "=",
		        },
		        controller: function($scope) {
		        	var type = proxyObjectResolver($scope.servo, 'type');
		        	$scope.poseable = type.poseable == true && $scope.servo.poseable != false;
		        	if($scope.servo.maxSpeed === undefined) {
		        		$scope.maxSpeed = type.maxSpeed;
		        	} else {
		        		$scope.maxSpeed = $scope.servo.maxSpeed;
		        	}
		        	if($scope.servo.minSpeed === undefined) {
		        		$scope.minSpeed = type.minSpeed;
		        	} else {
		        		$scope.minSpeed = $scope.servo.minSpeed;
		        	}
		        	if($scope.servo.maxPosition === undefined) {
		        		$scope.maxPosition = type.maxPosition;
		        	} else {
		        		$scope.maxPosition = $scope.servo.maxPosition;
		        	}
		        	if($scope.servo.minPosition === undefined) {
		        		$scope.minPosition = type.minPosition;
		        	} else {
		        		$scope.minPosition = $scope.servo.minPosition;
		        	}
		        }
			  };

	return def;		
  }])
;
