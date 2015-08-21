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
        banner: '/*! <%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/js/<%=pkg.name%>-<%=pkg.version%>.js',        
        dest: 'dist/js/<%=pkg.name%>-<%=pkg.version%>.min.js'
      }
    },

    //less插件的配置信息
    less: {
      build: {
        src: 'src/css/wangEditor.less',
        dest: 'src/css/wangEditor.css'
      }
    },

    //cssmin插件的配置信息
    cssmin: {
      options: {
        stripBanners: true,
        banner: '/*! <%=pkg.name%>-<%=pkg.version%>.css <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/css/concat/<%=pkg.name%>-<%=pkg.version%>.css',
        dest: 'dist/css/<%=pkg.name%>-<%=pkg.version%>.min.css'
      }
    },

    //jshint插件的配置信息'
    jshint:{
      build: [ 'Gruntfile.js', 'src/js/*.js' ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    //csslint插件的配置信息
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      build: [ 'src/css/*.css' ]
    },

    //concat插件的配置信息
    concat: {
      css:{
        src: 'src/css/*.css',
        dest: 'src/css/concat/<%=pkg.name%>-<%=pkg.version%>.css'
      },
      menus:{
        src: 'src/js/parts/11-fn-menus/*.js',
        dest: 'src/js/parts/11-fn-menus.js'
      },
      build:{
        src: 'src/js/parts/*.js',
        dest: 'src/js/<%=pkg.name%>-<%=pkg.version%>.js'
      }
    },

    // watch插件的配置信息
    watch: { 
      build: { 
        files: ['src/js/parts/*.js', 'src/css/*.less', 'src/css/fontIcon.css'], 
        tasks: ['less', 'jshint', 'csslint', 'concat','uglify', 'cssmin'], 
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
    //注意下面注册任务时的前后顺序
    'less',
    'jshint', 
    'csslint', 
    'concat',
    'uglify', 
    'cssmin',     
    'watch'
  ]);
 
};