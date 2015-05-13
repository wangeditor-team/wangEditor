// 包装函数
module.exports = function(grunt) {
 
  // 任务配置,所有插件的配置信息
  grunt.initConfig({

    //获取 package.json 的信息
    pkg: grunt.file.readJSON('package.json'),
    
    // uglify插件的配置信息
    uglify: {
      options: {
        banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/concat/<%=pkg.name%>-<%=pkg.version%>.js',        
        dest: 'js/build/<%=pkg.name%>-<%=pkg.version%>.min.js'
      }
    },

    //less插件的配置信息
    less: {
      build: {
        src: 'css/src/wangEditor.less',
        dest: 'css/src/wangEditor.css'
      }
    },

    //cssmin插件的配置信息
    cssmin: {
      options: {
        banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'css/concat/<%=pkg.name%>-<%=pkg.version%>.css',
        dest: 'css/build/<%=pkg.name%>-<%=pkg.version%>.min.css'
      }
    },

    //jshint插件的配置信息'
    jshint:{
      build: [ 'Gruntfile.js', 'js/src/*.js' ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    //csslint插件的配置信息
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      build: [ 'css/src/*.css' ]
    },

    //concat插件的配置信息
    concat: {
      css:{
        src: 'css/src/*.css',
        dest: 'css/concat/<%=pkg.name%>-<%=pkg.version%>.css'
      },
      js:{
        src: 'js/src/*.js',
        dest: 'js/concat/<%=pkg.name%>-<%=pkg.version%>.js'
      }
    },

    // watch插件的配置信息
    watch: { 
      build: { 
        files: ['js/src/*.js', 'css/src/*.less', 'css/src/fontIcon.css'], 
        tasks: ['concat', 'uglify', 'less', 'cssmin','jshint', 'csslint'], 
        options: { spawn: false}
      }
    }

  });
 
  // 告诉grunt我们将使用插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
 
  // 告诉grunt当我们在终端中输入grunt时需要做些什么（注意先后顺序）
  grunt.registerTask('default', [
    'concat',
    'uglify', 
    'less', 
    'cssmin', 
    'jshint', 
    'csslint', 
    'watch'
  ]);
 
};