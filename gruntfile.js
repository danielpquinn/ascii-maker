module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    
    watch: {
      dist: {
        files: 'static/stylesheets/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true
        }
      }
    },

    sass: {
      dist: {
        files: {
          'static/stylesheets/screen.css': 'static/stylesheets/screen.scss'
        }
      }
    }

  });

  grunt.registerTask('build', ['sass']);

}