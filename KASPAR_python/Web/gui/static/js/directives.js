'use strict';

/* Directives */


angular.module('kasparGUI.directives', []).
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
  .directive('advancedPoseEditor', function() {
	  var def = {
			  templateUrl: 'static/partials/action/poseadvanced.html',
			  restrict: 'E',
			  scope: {
				  pose: "=",
				  jointNames: "=",
			  },
			  controller: function($scope) {
				  
			  },
	  };
	  
	  return def;
  })
  .directive('jointEditor', function() {
	var def = {
				templateUrl: 'static/partials/action/joint.html',
				restrict: 'E',
				scope: {
		            jointPosition: "=",
		            jointNames: "=",
		        },
		        controller: function($scope) {
		        }
			  };

	return def;		
  })
;
