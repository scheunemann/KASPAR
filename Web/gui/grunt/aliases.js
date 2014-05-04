module.exports = {
	default: [
	          'requirejs',
	          'jshint:src',
	         ],
     build : [
              'clean:dist',
              'bowercopy',
              'jshint:dist',
              'requirejs',
              ],
};
