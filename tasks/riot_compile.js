/*
 * grunt-riot-compile
 * https://github.com/Swaven/grunt-riot-compile
 *
 * Copyright (c) 2016 Swaven
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('riot_compile', 'Compiles riot tags from HTML and coffeescript', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var done = this.async(),
        fs = require('fs'),
        path = require('path'),
        EventEmitter = require('events').EventEmitter,
        riot = require('riot'),
        exec = require('child_process').exec;

    // get args & directories
    var cwd = process.cwd(),
        options = this.options(),
        coffeeDir = path.resolve(cwd, this.data.coffee),
        htmlDir = path.resolve(cwd, this.data.html),
        outputDir = path.resolve(cwd, this.data.dest)

    //console.log(coffeeDir + ' ' + htmlDir + ' ' + outputDir)

    var browseEvt = new EventEmitter(),
        browsed = 0, coffeeFiles = [], htmlFiles = [],
        processedTagsEvt = new EventEmitter()

    /* handles results of walk method (recursive search) */
    function browseHandler (err, files){
      if (err)
        showErr(err)

      if (coffeeFiles.length === 0){
        coffeeFiles = files.filter(function(file,i,a){
          return (path.extname(file) === '.coffee');
        });
      }

      if (htmlFiles.length ===0){
        htmlFiles = files.filter(function(file,i,a){
          return (path.extname(file) === '.html');
        });
      }

      if (++browsed === 2){
        browseEvt.emit('done', {coffees: coffeeFiles, htmls: htmlFiles});
      }
    };

    // get files
    walk(coffeeDir, browseHandler);
    walk(htmlDir, browseHandler);

    /* triggered when browsing for files is complete */
    browseEvt.on('done', function(files){
      var processedTagsCount = 0

      // create destination folder
      fs.mkdir(outputDir, function(err){
        // ignore error when folder already exists
        if (err && err.code !== 'EEXIST') showErr(err, 'Cannot create tags folder')
      })

      // loop coffee files
      for(var f in files.coffees){
        var coffee = files.coffees[f],
            name = path.basename(coffee, '.coffee'),
            html = '';

        // find corresponding template file
        for (var f in files.htmls){
          if (files.htmls[f].indexOf(name + '.html') > -1){
            html = files.htmls[f]
            break
          }
        }
        if (html === '')
          throw 'No template file matching ' + name + '.coffee'

          createTag(name, coffee, html, function(){
            // wait for all tag files to be created before compiling
            if (++processedTagsCount === files.coffees.length){
              grunt.log.writeln(processedTagsCount + ' tags created');
              done(true);
            }
          })
      }
    });

    /* Creates tag file */
    function createTag(tagName, coffeeFile, htmlFile, callback){
      //console.log(tagName + ': ' + coffeeFile + ' - '  + htmlFile)
      var coffee = fs.readFileSync(coffeeFile, {encoding: 'utf8'}),
          // read html content, add indentation to avoid compiling child custom tags
          html = fs.readFileSync(htmlFile, {encoding: 'utf8'}).replace(/\n/g, '\n  '),
          outPath = path.resolve(outputDir, tagName + '.js'),
          // file content pattern
          content = '<{tag}>\n  {html}\n<script type="coffee">{coffee}\n</script>\n</{tag}>',
          compiledTag = ''

      // create tag content
      content = content.replace(/\{tag\}/g, tagName)
      .replace('{html}', html)
      .replace('{coffee}', coffee)

      compiledTag = riot.compile(content);

      fs.writeFile(outPath, compiledTag, 'utf8', function(err){
        if (err) showErr(err);
        else
          grunt.log.writeln('Compile ' + outPath);
        if (callback) callback.apply();
      })
    };

    /* display error */
    function showErr(err, msg){
      var msg = msg ? msg+ ': ': 'Error: '
      for (var k in err){
        msg += k + ': ' + err[k] + '. ';
      }

      throw (msg)
    };

    /* Recursive file search */
    function walk(dir, done) {
      var results = [];
      fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
          file = dir + '/' + file;
          fs.stat(file, function(err, stat) {
            if (stat && stat.isDirectory()) {
              walk(file, function(err, res) {
                results = results.concat(res);
                if (!--pending) done(null, results);
              });
            } else {
              results.push(file);
              if (!--pending) done(null, results);
            }
          });
        });
      });
    };
  });
};
