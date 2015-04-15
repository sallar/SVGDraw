module.exports = function(grunt) {
    'use strict';
    /**
     * Config
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'dist/css/style.css' : 'src/css/style.scss'
                },
                options: {
                    outputStyle: 'compressed'
                }
            }
        },
        autoprefixer: {
            dist: {
                files: {
                    'dist/css/style.css': 'dist/css/style.css'
                }
            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            livereload: {
                files: [
                    'src/js/app/tpl/*.html',
                    'src/js/app/**/*.js',
                    'dist/css/style.css'
                ]
            },
            sass: {
                files: 'src/css/**/*.scss',
                tasks: ['sass', 'autoprefixer']
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl                 : "src/js",
                    mainConfigFile          : "src/js/config.js",
                    out                     : "dist/js/all.js",
                    name                    : "config",
                    wrapShim                : true,
                    generateSourceMaps      : true,
                    preserveLicenseComments : false,
                    optimize                : "uglify2"
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/js/**/*.js']
        }
    });

    /**
     * Load
     */
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    /**
     * Register
     */
    grunt.registerTask('default',['watch']);
};