module.exports = {
	all : {
		files : {
			"dist/fullapp.min.js" : [ "dist/fullapp.js" ]
		},
		options : {
			mangle : false,
			preserveComments : false,
			sourceMap : "dist/fullapp.min.map",
			sourceMappingURL : "fullapp.min.map",
			report : "min",
			beautify : {
				ascii_only : true
			},
			wrap : {
				start : "(function() {",
				end : "}());"
			},
		}
	}
}
