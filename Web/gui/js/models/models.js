(function() {
	'use strict';

	var dependancies = [
                    	'js/services/proxyServices',
	                    'js/models/Action',
	                    'js/models/ActionTest',
	                    'js/models/ActionType',
	                    'js/models/ButtonHotkey',
	                    'js/models/CustomAction',
	                    'js/models/CustomTrigger',
	                    'js/models/Interaction',
	                    'js/models/JointPosition',
	                    'js/models/Menu',
	                    'js/models/Operator',
	                    'js/models/OrderedAction',
	                    'js/models/Robot',
	                    'js/models/RobotInterface',
	                    'js/models/RobotModel',
	                    'js/models/Sensor',
	                    'js/models/SensorGroup',
	                    'js/models/SensorModel',
	                    'js/models/Servo',
	                    'js/models/ServoConfig',
	                    'js/models/ServoGroup',
	                    'js/models/ServoInterface',
	                    'js/models/ServoModel',
	                    'js/models/Setting',
	                    'js/models/Trigger',
	                    'js/models/TriggerType',
	                    'js/models/User',
	                    'js/models/UserAction'
	                    ];	
	
	define(dependancies, function(
			proxyServices,
			Action,
            ActionTest,
            ActionType,
            ButtonHotkey,
            CustomAction,
            CustomTrigger,
            Interaction,
            JointPosition,
            Menu,
            Operator,
            OrderedAction,
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
            ServoModel,
            Setting,
            Trigger,
            TriggerType,
            User,
            UserAction){

		var moduleName = 'kasparGUI.models';
		var factoryDeps = [
		                  'ngResource'
		                  ];
		
		var module = angular.module(moduleName, factoryDeps)
			.factory('Action', Action)
			.factory('ActionTest', ActionTest)
			.factory('ActionType', ActionType)
			.factory('ButtonHotkey', ButtonHotkey)
			.factory('CustomAction', CustomAction)
			.factory('CustomTrigger', CustomTrigger)
			.factory('Interaction', Interaction)
			.factory('JointPosition', JointPosition)
			.factory('Menu', Menu)
			.factory('Operator', Operator)
			.factory('OrderedAction', OrderedAction)
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
			.factory('ServoModel', ServoModel)
			.factory('Setting', Setting)
			.factory('Trigger', Trigger)
			.factory('TriggerType', TriggerType)
			.factory('User', User)
			.factory('UserAction', UserAction)
		
		return module;
	});
}());
