(function() {
	'use strict';
	
	var dependancies = [
	                    'js/controllers/ActionController',
	                    'js/controllers/ActionTestController',
	                    'js/controllers/CommonController',
	                    'js/controllers/InteractionController',
	                    'js/controllers/NavBarController',
	                    'js/controllers/OperatorController',
	                    'js/controllers/RobotController',
	                    'js/controllers/SettingsController',
	                    'js/controllers/TriggerController',
	                    'js/controllers/UserController'
	                    ];
	
	define(dependancies, function(
			ActionController,
            ActionTestController,
            CommonController,
            InteractionController,
            NavBarController,
            OperatorController,
            RobotController,
            SettingsController,
            TriggerController,
            UserController
            ){
		
		var moduleName = 'kasparGUI.controllers';
		var controllerDeps = [ 'kasparGUI.models', 'kasparGUI.proxyServices', 'ui.router', 'kasparGUI.displayServices' ];
		
		var module = angular.module(moduleName, controllerDeps)
			.controller('actionController', ActionController)
			.controller('actionTestController', ActionTestController)
			.controller('commonController', CommonController)
			.controller('interactionController', InteractionController)
			.controller('navBarController', NavBarController)
			.controller('operatorController', OperatorController)
			.controller('robotController', RobotController)
			.controller('settingsController', SettingsController)
			.controller('triggerController', TriggerController)
			.controller('userController', UserController);
		
		return module;
	});	
}());
