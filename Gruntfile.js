module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.description %>, <%= pkg.version %> <%= pkg.homepage %>\n' +
                'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, <%= pkg.license.type %> license ' +
                '<%= pkg.license.url %>*/\n'
        },
        jshint:{
            options:{
                curly:true,
                eqeqeq:true,
                forin:true,
                indent:2,
                latedef:false,
                newcap:true,
                noarg:true,
                noempty:true,
                white:false,
                sub:true,
                undef:true,
                unused:true,
                loopfunc:true,
                expr:true,
                evil:true,
                eqnull:true
            },
            all: ['src/jquery.popunder.js']
        },
        jsObfuscate: {
            dist: {
                options: {
                    concurrency: 2,
                    keepLinefeeds: false,
                    keepIndentations: false,
                    encodeStrings: true,
                    encodeNumbers: true,
                    moveStrings: true,
                    replaceNames: true,
                    variableExclusions: ['^_get_', '^_set_', '^_mtd_']
                },
                files: {
                    'dist/jquery.popunder.obfuscated.min.js': [
                        'dist/jquery.popunder.min.js'
                    ]
                }
            }
        },
        uglify:{
            dist: {
                files: {
                    'dist/jquery.popunder.min.js': ['src/jquery.popunder.js']
                },
                options: {
                    banner: '<%=meta.banner%>',
                    report: 'min',
                    preserveComments: false
                }
            },
            jqLess: {
                files: {
                    'dist/popunder.min.js': ['src/jquery.min.js', 'src/jquery.popunder.js']
                },
                options: {
                    banner: '<%=meta.banner%>',
                    report: 'min',
                    preserveComments: false
                }
            }
        },
        shell:{
            haxe: {
                command: '../../node_modules/.bin/haxe compile.hxml',
                options: {
                    stdout: true,
                    stderr: true,
                    execOptions: {
                        cwd: './src/hx'
                    }
                }
            },
            update_bower: {
                command: 'bower update',
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            update_prepare: {
                command: [
                    'rm -rf ./bower_components/jquery-raw',
                    'mkdir ./bower_components/jquery-raw'
                ].join(' && ')
            },
            update_buildJquery: {
                command: [
                    'rm -rf jquery',
                    'git clone git://github.com/jquery/jquery.git',
                    'cd jquery',
                    'git checkout tags/`git tag | grep -v "-" | tail -n 1`',
                    'npm install',
                    'grunt custom:-event-alias,-ajax,-ajax/script,-ajax/jsonp,-ajax/xhr,-effects,-deprecated,-exports/amd',
                    'cp -f dist/jquery.min.js ../../../src/jquery.min.js'
                ].join(' && '),
                options: {
                    execOptions: {
                        cwd: './bower_components/jquery-raw'
                    },
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            }
        },
        watch:{
            files:['src/*.js'],
            tasks:'lint'
        }
    });


    // load tasks
    grunt.loadNpmTasks('js-obfuscator');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('update', ['shell:update_bower', 'shell:update_prepare', 'shell:update_buildJquery', 'default']);
    grunt.registerTask('default', ['jshint', 'uglify', 'jsObfuscate', 'shell:haxe']);
};
