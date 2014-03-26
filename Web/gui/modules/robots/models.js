(function() {
	'use strict';

	var dependancies = [
	                    'angular',
	                    'angularResource',
                    	'modules/common/services/proxyServices',
	                    './models/Robot',
	                    './models/RobotInterface',
	                    './models/RobotModel',
	                    './models/Sensor',
	                    './models/SensorGroup',
	                    './models/SensorModel',
	                    './models/Servo',
	                    './models/ServoConfig',
	                    './models/ServoGroup',
	                    './models/ServoInterface',
	                    './models/ServoModel',
	                    ];	
	
	define(dependancies, function(
			angular,
			resource,
			proxyServices,
            Robot,
            RobotInterface,
            RobotModel,
            Sensor,
            SensorGroup,
            SensorModel,
            Servo,
            ServoConfig,
            ServoGroup,
            ServoInterface,
            ServoModel){

		var moduleName = 'kasparGUI.robots.models';
		var factoryDeps = [
		                   	'ngResource',
		                  	proxyServices,
		                  ];
		
		var module = angular.module(moduleName, factoryDeps)
			.factory('Robot', Robot)
			.factory('RobotInterface', RobotInterface)
			.factory('RobotModel', RobotModel)
			.factory('Sensor', Sensor)
			.factory('SensorGroup', SensorGroup)
			.factory('SensorModel', SensorModel)
			.factory('Servo', Servo)
			.factory('ServoConfig', ServoConfig)
			.factory('ServoGroup', ServoGroup)
			.factory('ServoInterface', ServoInterface)
			.factory('ServoModel', ServoModel);
		
		module.config(['$httpProvider', function($httpProvider) {
			$httpProvider.interceptors.push('proxyResourceInterceptor');
		}]);

		return moduleName;
	});
}());
