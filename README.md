## Simple SVG Drawing App
This is an experimental SVG drawing web app. Strictly for educational purposes.
Best performance in Chrome (for now)

![Preview](https://dl.dropboxusercontent.com/u/16657557/Works/SVGDraw/out.gif)

### Todo:
 - Edit In Place
 - Export to SVG

### Instructions
Watch for changes and compile during development:  
```bash
$ npm install -g grunt-cli # Install Grunt Cli 
$ npm install -g bower # Install Bower
$ npm install # Install Node Dependencies
$ bower install # Install Bower Dependencies
$ grunt watch
```
Compile all js files using RequireJS for production:  
```bash
$ grunt requirejs
```
Test
```bash
$ grunt jsjint
```

### License
Released under the [MIT License](http://sallar.mit-license.org/). © 2015 Sallar Kaboli.

    The MIT License (MIT)
    
    Copyright (C) 2003-2015 Sallar Kaboli <sallar.kaboli@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    1- The above copyright notice and this permission notice shall be included
    in all copies or substantial portions of the Software.
    
    2- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
