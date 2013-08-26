module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');

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
    },

    jsdoc: {
      dist: {
        src: ['static/js/app.js', 'static/js/lib/asciigenerator.js'],
        options: {
          destination: 'doc',
          template: "node_modules/ink-docstrap/template",
          configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
        }
      }
    }

  });

  grunt.registerTask('build', ['sass', 'jsdoc']);

}