var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'noteEditor.tpl.html',
      controller: NoteEditorCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.selectedNote;
        }
      }
    });

    modalInstance.result.then(function (note) {
      scope.addNote(note)
    }, function (reason) {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

var NoteEditorCtrl = function ($scope, $modalInstance, note) {

  $scope.note = note;

  $scope.ok = function () {
    $modalInstance.close($scope.note);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};