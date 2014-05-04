'use strict';

define(function(require) {
	var enGB = require('../i18n/en-gb');

	var Language = function() {
		this.language = "en-gb";

		this.setLanguage = function(language) {
			this.language = language;
		};
		
		this.getText = function() {
			return enGB;
		};
	};

	return Language;
});