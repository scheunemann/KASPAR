'use strict';

define(function(require) {
	var Trigger = function($rootScope, modelBuilder) {
		var resource = modelBuilder.getModel('Trigger');

		resource.prototype.fillConcreteClassData = function() {
			if (this.$concreteResolved || this.type == undefined) { return; }

			var concreteModel = modelBuilder.getModel(this.type);

			if (this.id != undefined) {
				var self = this;
				concreteModel.get({
					id : this.id
				}).$promise.then(function(res) {
					angular.extend(self, res);
					$rootScope.$$phase || $rootScope.$digest();
					this.$concreteResolved = true;
				});
			} else {
				angular.extend(this, new _service());
				$rootScope.$$phase || $rootScope.$digest();
				this.$concreteResolved = true;
			}
		};

		return resource;
	};

	return [ '$rootScope', 'modelBuilder', Trigger ];
});
