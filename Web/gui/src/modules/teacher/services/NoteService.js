'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./noteEditor.tpl.html');

	var NoteService = function(Note, $modal) {
		this.addNote = function(title, notes) {
			var note = _.findWhere(notes, {title: title});
			if (!note) {
				note = new Note({title: title});
			}
			
			var modalInstance = $modal.open({
				template : template,
				controller : function($scope, $modalInstance, note) {

					$scope.note = note;

					$scope.ok = function() {
						$modalInstance.close($scope.note);
					};

					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				},
				resolve : {
					note : function() {
						return $scope.selectedNote;
					},
					editableTitle : function() {
						return !title;
					}
				}
			});

			modalInstance.result.then(function(note) {
				if(notes.indexOf(note) < 0)
					notes.push(note);
				}
			}, function(reason) {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
	};

	return ['Note', '$modal', NoteService];
});
