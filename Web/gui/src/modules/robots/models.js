'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');
	var proxyServices = require('common/services/proxyServices');
	var Robot = require('./models/Robot');
	var RobotInterface = require('./models/RobotInterface');
	var RobotModel = require('./models/RobotModel');
	var Sensor = require('./models/Sensor');
	var SensorGroup = require('./models/SensorGroup');
	var SensorModel = require('./models/SensorModel');
	var Servo = require('./models/Servo');
	var ServoConfig = require('./models/ServoConfig');
	var ServoGroup = require('./models/ServoGroup');
	var ServoInterface = require('./models/ServoInterface');
	var ServoModel = require('./models/ServoModel');

	var moduleName = 'kasparGUI.robots.models';
	var dependancies = [
	                   	'ngResource',
	                  	proxyServices,
	                  ];
	
	var module = angular.module(moduleName, dependancies)
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
