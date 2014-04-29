module.exports = {
	main : {
		files : [ {
			expand : true,
			src : [ 'src/bower_components/**/*.js' ],
			dest : 'build/bower_components/',
		}, {
			expand : true,
			src : [ 'src/bower_components/**/*.css' ],
			dest : 'build/bower_components/',
		}, ],
	},
}