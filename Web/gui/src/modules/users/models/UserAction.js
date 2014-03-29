'use strict';

define([ 
        'angular', 
        'angularResource' 
      ], function(angular) {

	var UserAction = function($resource) {
		return $resource('/api/interaction/useraction/:button_id', {
			button_id : '@button_id'
		}, {
			cache : true
		});
	};

	return [ '$resource', UserAction ];
});
