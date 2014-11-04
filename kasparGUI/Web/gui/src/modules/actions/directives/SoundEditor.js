'use strict';

define(function(require) {
	require('angular');
	require('common/directives');
	var template = require('text!./soundEditor.tpl.html');

	var SoundEditor = function(language, $parse) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				sound : "=action",
			},
			controller : function($scope, $http) {
				$scope.language = language.getText();

                                $scope.save = function() {
                                    $scope.sound.$save();
                                };

				$scope.uploadSound = function(file) {
					var fd = new FormData();
					fd.append('sound', file);
					$http.post('/api/SoundData', fd, {
						transformRequest : angular.identity,
						headers : {
							'Content-Type' : undefined
						}
					}).success(function(data, status, headers, config) {
						$scope.sound.uuid = data.uuid;
						$scope.sound.$save();
					});
				};
			},
		};
	};

	return [ 'language', '$parse', SoundEditor ];
});
