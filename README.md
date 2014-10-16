# angular-froala
angular-froala provides AngularJS bindings to the froala WYSIWYG editor.

## Installation

1. Clone this repo or download the zip.
2. Run `bower install` or Download the editor from [http://editor.froala.com/](http://editor.froala.com/) and jQuery
3. Load Froala WYSIWYG editor, jquery and the angular-froala files into your project
	- src/angular-froala.js
	- src/froala-sanitize.js

## Usage

1. Add the `froala` dependency to your Angular project. example:
	* `angular.module('myApp', ['froala'])`
2. Create a textarea with the froala directive in your view and give it a model, where `myHtml` is a variable on `$scope`.
	* `<textarea froala ng-model="myHtml"><textarea> `

###Options

**Setting Defaults**: to set defaults for the editor pass a config object to angular.value with the key `froalaConfig` like this:
```javascript
angular.module('myApp', ['froala']).
	value('froalaConfig', {
		inlineMode: false,
		placeholder: 'Enter Text Here'
	});
```

**From the Controller**: to set options from the controller, create an options object on scope and simply pass it to the froala directive. example:

_app.js_

```javascript
function myCtrl($scope){
	$scope.myHtml = "<h1>Hello World</h1>"
	$scope.froalaOptions = {
		buttons : ["bold", "italic", "underline", "sep", "align", "insertOrderedList", "insertUnorderedList"]
	}
}
```
_view.html_

```html
<textarea froala="froalaOptions" ngModel="myHtml"></textarea>
```
View a list of all the options avaible in the [docs](http://editor.froala.com/options)

###Methods

To use the methods availible, access the editor instance from your froalaOptions object `$scope.options.froala(method)` and use it as described in the [method docs](http://editor.froala.com/methods). example:

```javascript
function myCtrl($scope){
	$scope.myHtml = "";
	$scope.froalaOptions = {
		buttons : ["bold", "italic", "underline", "sep", "align", "insertOrderedList", "insertUnorderedList"]
	}

//Use the methods like this
$scope.froalaOptions.froala("getSelection");
```
###Events
 - todo

###Displaying Html

Using `ng-bind-html` will render your html on the page but the default angular-sanitize.js will strip out all style tags. Remedy this by including `froala-sanitize.js` instead. example: `<div ng-bind-html="myHtml"></div>`

Congrats all is done!

## License

The `angular-froala` project is under MIT license.

You may use the editor for non-commercial websites for free under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](http://creativecommons.org/licenses/by-nc-nd/4.0/).

Froala Editor has [4 different licenses](http://editor.froala.com/download/) for commercial use.
For details please see [License Agreement](http://editor.froala.com/license).