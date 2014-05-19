module.exports = {
	all : {
		files : {
			"dist/app.min.js" : [ "dist/app.js" ]
		},
		options : {
			mangle : false,
			preserveComments : false,
			sourceMap : "dist/app.min.map",
			sourceMappingURL : "app.min.map",
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