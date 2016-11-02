# grunt-riot-compile

> Compiles riot tags from separate HTML and coffeescript files

## Getting Started
This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-riot-compile --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-riot-compile');
```

## The "riot_compile" task

### Overview
In your project's Gruntfile, add a section named `riot_compile` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  riot_compile: {
    your_target: {
      coffee: some_path,
      html: some_other_path,
      dest: another_path
    },
  },
});
```

**Dependencies:**  
 - riot@2.6.5
 - coffee-script@1.11.1

### Options

*None yet*


### Properties

#### coffee
Type: `String`

Path to the folder containing coffeescript files.

#### html
Type: `String`

Path to the folder containing HTML templates.

#### dest
Type: `String`

Path to the folder where tags will be saved.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2016-11-02: [v2.6.5](https://github.com/Swaven/grunt-riot-compile/releases/tag/v2.6.5): use riot 2.6.5
* 2016-10-05: [v2.6.2-2](https://github.com/Swaven/grunt-riot-compile/releases/tag/v2.6.2-2): use coffee-script 1.11.1
* 2016-09-28: [v2.6.2](https://github.com/Swaven/grunt-riot-compile/releases/tag/v2.6.2): use riot 2.6.2
* 2016-09-26: [v2.4.1](https://github.com/Swaven/grunt-riot-compile/releases/tag/v2.4.1): first release
