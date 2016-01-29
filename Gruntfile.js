// 包装函数
module.exports = function(grunt) {
 
  // 任务配置,所有插件的配置信息
  grunt.initConfig({

    //获取 package.json 的信息
    pkg: grunt.file.readJSON('package.json'),
    
    // uglify插件的配置信息
    uglify: {
      options: {
        stripBanners: true,
        banner: '/*! <%=pkg.name%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/js/<%=pkg.name%>.js',
        dest: 'dist/js/<%=pkg.name%>.min.js'
      }
    },

    //less插件的配置信息
    less: {
      editor: {
        src: 'src/css/<%=pkg.name%>.less',
        dest: 'src/css/<%=pkg.name%>.css'
      }
    },

    //cssmin插件的配置信息
    cssmin: {
      options: {
        stripBanners: true,
        banner: '/*! <%=pkg.name%>.css <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/css/<%=pkg.name%>.css',
        dest: 'dist/css/<%=pkg.name%>.min.css'
      }
    },

    //jshint插件的配置信息'
    jshint:{
      build: [ 'Gruntfile.js', 'src/js/*.js' ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    //concat插件的配置信息
    concat: {
      css:{
        src: 'src/css/parts/*.less',
        dest: 'src/css/<%=pkg.name%>.less'
      },
      js:{
        src: 'src/js/parts/*.js',
        dest: 'src/js/<%=pkg.name%>.js'
      }
    },

    //copy插件的配置信息
    copy: {
      main: {
        files:[
          //js
          {
            expand: true, 
            flatten: true,
            src: ['src/js/*.js'], 
            dest: 'dist/js/', 
            filter: 'isFile'
          },
          //less
          {
            expand: true, 
            flatten: true,
            src: ['src/css/*.less'], 
            dest: 'dist/css/', 
            filter: 'isFile'
          },
          //css
          {
            expand: true, 
            flatten: true,
            src: ['src/css/*.css'], 
            dest: 'dist/css/', 
            filter: 'isFile'
          }
        ]
      }
    },

    // watch插件的配置信息
    watch: { 
      js: { 
        files: [
          'src/js/parts/*.js'
        ], 
        tasks: [
          'concat', 
          'jshint', 
          'uglify',
          'copy'
        ], 
        options: { spawn: false}
      },
      css:{
        files: [
          'src/css/parts/*.less'
        ], 
        tasks: [
          'concat', 
          'less', 
          'cssmin',
          'copy'
        ], 
        options: { spawn: false}
      }
    }

  });
 
  // 告诉grunt我们将使用插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
 
  // 告诉grunt当我们在终端中输入grunt时需要做些什么（注意先后顺序）
  grunt.registerTask('default', [
    //注意下面注册任务时的前后顺序
    'concat',
    'less',
    'jshint', 
    'uglify', 
    'cssmin',
    'copy',
    'watch'
  ]);
 
};