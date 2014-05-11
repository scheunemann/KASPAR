module.exports = {
	hint : [ 'requirejs', 'jshint:src', ],
	build : [ 'clean:dist', 'bowercopy', 'jshint:dist', 'requirejs', ],
	default: [ 'clean:dist', 'bowercopy', 'requirejs', ],
};
