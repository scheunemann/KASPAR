'use strict';

define(function(require) {
        var angular = require('angular');
        var template = require('text!./noteEditor.tpl.html');
        var _ = require('underscore');

        var NoteService = function(Note, $modal, $log) {
            this.addNote = function(title, editableTitle, notes) {
                var note = _.findWhere(notes, {
                        title: title
                    });
                if (!note) {
                    note = new Note({
                            title: title
                        });
                }

                var modalInstance = $modal.open({
                        template: template,
                        controller: function($scope, $modalInstance, note, editableTitle) {

                            $scope.note = note;
                            $scope.editableTitle = editableTitle;

                            $scope.ok = function() {
                                $modalInstance.close($scope.note);
                            };

                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {
                            note: function() {
                                return note;
                            },
                            editableTitle: function() {
                                return editableTitle;
                            }
                        }
                    });

                modalInstance.result.then(function(note) {
                        if (notes.indexOf(note) <= 0) {
                            notes.push(note);
                        }
                    }, function(reason) {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
            };
        };

        return ['Note', '$modal', '$log', NoteService];
    });
