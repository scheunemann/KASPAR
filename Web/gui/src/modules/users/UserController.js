'use strict';

define([ 
        'angular',
        'common/services/proxyServices',
        'actions/models',
        'triggers/models',
        'users/models',
        ], function(
		angular, 
		proxyServices, 
		actionModels, 
		triggerModels, 
		userModels) {
	'use strict';

	var UserController = function($scope, $filter, User, CustomAction, CustomTrigger, Action, Trigger, proxyObjectResolver) {
		$scope.users = User.query(function() {
			$scope.selectedUser = $scope.users[0];
		});

		$scope.$watch('selectedUser', function() {
			proxyObjectResolver.resolveProp($scope.selectedUser, 'customActions');
			proxyObjectResolver.resolveProp($scope.selectedUser, 'customTriggers');
		});
	};

	return [ '$scope', '$filter', 'User', 'CustomAction', 'CustomTrigger', 'Action', 'Trigger', 'proxyObjectResolver', UserController ];

});
