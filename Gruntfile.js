'use strict';
module.exports = function (grunt) {

    //Properties
    var templateDirectory = "template"
    var sourceDirectory = "source";
    var readyDirectory = "ready";

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // show elapsed time at the end
    require('time-grunt')(grunt);

    // initialize the configuration object
    grunt.initConfig({

            //Load properties
            pkg: grunt.file.readJSON('package.json'),
            config: grunt.file.readJSON('config.json'),


            /*****************************************************
             Task:
             CLEAN - Delete resources, clean folders
             */
            clean: {
                all: [readyDirectory]
            },


            /*****************************************************
             Task:
             SASS - Transpile stylesheets with SCSS
             */
            sass: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: sourceDirectory+'/assets/css/',
                        src: ['*.scss'],
                        dest: readyDirectory+'/css/',
                        ext: '.min.css'
                    }]
                },
                emails: {
                    options: {
                        sourcemap: 'none'
                    },
                    files: [{
                        expand: true,
                        cwd: 'email-templates/',
                        src: ['*.scss'],
                        dest: 'email-templates/',
                        ext: '.css'
                    }]
                }
            },


            /*****************************************************
             Task:
             INLINECSS - Inline CSS
             */
            inlinecss: {
                emails: {
                    options: {
                        preserveFontFaces: true
                    },
                    files: [{
                        expand: true,
                        cwd: 'email-templates/',
                        src: ['*.html'],
                        dest: 'email-templates/ready',
                        ext: '.html'
                    }]
                }
            },


            /*****************************************************
             Task:
             BOWER_CONCAT - Merge all bower dependencies into one file
             */
            bower_concat: {
                libs: {
                    dest: readyDirectory+'/js/libs.js',
                    bowerOptions: { relative: false },
                }
            },


            /*****************************************************
             Task:
             CONCAT - Merge two or more files into one.
             */
            concat: {
                options: {
                    sourceMap: true,
                    banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */',
                    stripBanners: {
                        block: true
                    }
                }
            },


            /*****************************************************
             Task:
             COPY - Copy files from one location to another
             */
            copy: {
                main: {
                    files: [{
                        expand: true,
                        cwd: "./",
                        src: templateDirectory+"/**",
                        dest: sourceDirectory,
                        rename: function(param1, param2){
                            console.log("RENAME", param1, param2);
                            if(param2 === "template"){
                                return sourceDirectory+"/100x200/";
                            }else {
                                return sourceDirectory+"/100x200/"+Math.random();
                            }
                        }
                    }],
                    // src: templateDirectory,
                    // dest: sourceDirectory,
                    // options: {
                    //     process: function(content, srcpath){
                    //         console.log("COPY TASK", srcpath);
                    //         return false;
                    //     }
                    // }
                }
            },


            /*****************************************************
             Task:
             REPLACE - Replace text
             */
            replace: {

                // Development
                dev: {

                }
            },



            /*****************************************************
             Task:
             UGLIFY - Uglify and mangle javascript files
             */
            uglify: {
                my_target: {
                    files: [
                        {
                            expand: true,
                            cwd: readyDirectory,
                            src: ['js/*.js'],
                            dest: readyDirectory,
                            filter: 'isFile'
                        }
                    ]
                }
            },



            /*****************************************************
             Task:
             CSSMIN - Minify stylesheets
             */
            cssmin: {
                dist: {
                    files: [
                        {
                            expand: true,
                            cwd: readyDirectory,
                            src: ['css/*.css'],
                            dest: readyDirectory,
                            filter: 'isFile'
                        }
                    ]
                }
            },



            /*****************************************************
             Task:
             WATCH - Watch for changes on files or directories, and perform consequent tasks
             */
            watch: {
                main: {
                    files: [sourceDirectory+'/index.html'],
                    tasks: ['main']
                },
                app: {
                    files: sourceDirectory+'/app/app.*.js',
                    tasks: ['app', 'replace:dev']
                },
                css: {
                    files: sourceDirectory+'/assets/css/**/*.scss',
                    tasks: ['css']
                },
                language: {
                    files: sourceDirectory+'/assets/language/**/*.json',
                    tasks:['language']
                },
                images: {
                    files: sourceDirectory+'/assets/images/**/*',
                    tasks:['images']
                },
                views: {
                    files: [sourceDirectory+'/app/**/*.html'],
                    tasks: ['views']
                },
                common: {
                    files: [sourceDirectory+'/app/common/**/*.js'],
                    tasks: ['common']
                },
                modules: {
                    files: [sourceDirectory+'/app/modules/**/*.js'],
                    tasks: ['modules']
                },
                model: {
                    files: [sourceDirectory+'/app/model/**/*.js'],
                    tasks: ['model']
                },
                services: {
                    files: [sourceDirectory+'/app/services/**/*.js'],
                    tasks: ['services']
                },
                websocket: {
                    files: [sourceDirectory+'/app/websocket/**/*.js'],
                    tasks: ['websocket']
                },
                libs: {
                    files: '/lib/*',
                    tasks: ['libs']
                },

                emails: {
                    files: ['email-templates/*.html', 'email-templates/*.scss'],
                    tasks: ['sass:emails', 'inlinecss', 'replace:emails']
                }
            }


        }
    );

    // BUILD
    grunt.registerTask('generate', ['clean:main', 'copy:main', 'concat:app']);


};