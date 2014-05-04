module.exports = {
	src : {
		src : [ "src/**/*.js", "Gruntfile.js" ],
		options: {
			globalstrict: true,
			globals: {
				'define': false,
				'FormData': false,
				'console': false,
			}
		}
	},
	dist : {
		src : "dist/app.js",
	}
}