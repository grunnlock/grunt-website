'use strict';

module.exports = function( grunt ) {

	var devConfig = {
		port: 35722,
		dev:  'dev',
		dist: 'www',
		temp: '.tmp',
		folders: {
			js:     'js',
			css:    'css',
			less: 	'less',
			images: 'images'
		}
	};

	// Load grunt tasks automatically
	require('load-grunt-tasks')( grunt );

	// Time how long tasks take
	require('time-grunt')( grunt );

	grunt.initConfig({

		config: devConfig,

		// Watch files and do specific actions if they're edited
		watch: {
			options: {
            	livereload: { port: '<%= config.port %>' }
            },
            all: {
            	files: [
            		// '<%= config.dev %>/**/*'
            		'<%= config.dev %>/**/*.{php,html,htm,xml,txt,htaccess,js,ico,png,jpg,jpeg,gif,json}'
            	],
            },
            less: {
            	files: ['<%= config.dev %>/<%= config.folders.less %>/**/*.less'],
       			tasks: ['newer:less']
            }
        },

		// Check JS syntax to avoid errors
		jshint: {
			all: ['<%= config.dev %>/<%= config.folders.js %>/**/*.js']
		},

        // Delete files
        clean: {
        	serve: {
        		src: [
        			'.tmp'
        		]
        	},
        	build: {
				src: [
					'.tmp',
        			'<%= config.dist %>'
        		]
        	}
        },

        // Copy/paste files
		copy: {
			build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.dev %>',
                    src: [
                    	'**/*.{php,html,htm,txt,htaccess,xml,ico,pdf,json,mp3,mp4,ogg,mov,webm}',
                    	'*.{jpg,png}',
                    	'fonts/**/*'
                    ],
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // Less (CSS pre-processor)
		less: {
			serve: {
				files: [{
					expand: true,
					cwd:  '<%= config.dev %>/<%= config.folders.less %>',
					src:  [
						'**/*.less',
						'!imports/**/*'
					],
					dest: '<%= config.dev %>/<%= config.folders.css %>',
					ext:  '.css'
				}]
			}
		},

		// Minify HTML (and preserve PHP scripts)
		htmlclean: {
			options: {
				edit: function( html ) {
					return html.replace(/\begg(s?)\b/ig, 'omelet$1');
				}
			},
			build: {
				expand: true,
				cwd: '<%= config.dist %>',
				src: [
					'**/*.html',
					'!class.phpmailer.php'
				],
				dest: '<%= config.dist %>'
			}
		},

  		// Update header.php to delete livereload link
  		targethtml: {
			build: {
				files: {
					'<%= config.dist %>/<%= config.folders.php %>/index.html': '<%= config.dist %>/<%= config.folders.php %>/index.html'
				}
			}
		},

		// Run some tasks in parallel to speed up the processes
	    concurrent: {
	    	serve: [
	    		'less'
	    	],
	    	build: [
	    		'less',
	    		'imagemin'
	    	]
	    },

	    // Compress images
		imagemin: {
			build: {
				files: [{
					expand: true,
					cwd:  '<%= config.dev %>/<%= config.folders.images %>',
					src:  '**/*.{png,jpg,jpeg,gif,svg}',
					dest: '<%= config.dist %>/<%= config.folders.images %>'
				}]
			}
	    },

        // Rename files for browser caching purposes
		filerev: {
			build: {
				src: [
					'<%= config.dist %>/<%= config.folders.js %>/**/*.js',
					'<%= config.dist %>/<%= config.folders.css %>/**/*.css',
					'<%= config.dist %>/<%= config.folders.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
				]
			}
		},

		// Prepare, concat and minify requested files
		useminPrepare: {
			options: {
				root: '<%= config.dev %>',
				dest: '<%= config.dist %>'
			},
			html: '<%= config.dev %>/**/*.{php,html,htm}'
		},

		usemin: {
			options: {
                assetsDirs: [
	                '<%= config.dist %>',
	                '<%= config.dist %>/<%= config.folders.images %>',
	                '<%= config.dist %>/<%= config.folders.css %>',
	                '<%= config.dist %>/<%= config.folders.js %>'
                ]
            },
            html: ['<%= config.dist %>/**/*.{php,html,htm}'],
            css:  ['<%= config.dist %>/<%= config.folders.css %>/**/*.css']
		},

		// Upload files on different environments (FTP servers)
		dploy: {
			live: {
				host: '',
				user: '',
				pass: '',
				path: {
				    local:  'www/',
				    remote: 'public_html/'
				}
			},
			demo: {
				host: '',
				user: '',
				pass: '',
				path: {
				    local:  'www/',
				    remote: 'public_html/demo/'
				}
			},
		},

	});

	grunt.registerTask('serve', [
		'jshint',
		'clean:serve',
		'concurrent:serve',
		'watch'
	]);

	grunt.registerTask('default', [
		'jshint',
		'build'
	]);

	grunt.registerTask('build', [
		'clean:build',
		'concurrent:build',
		'copy:build',
	    'targethtml:build',
		'useminPrepare',
		'concat',
	    'uglify',
	    'cssmin',
	    'filerev',
	    'usemin',
	    'htmlclean'
	]);

};