# angular-froala
angular-froala provides AngularJS bindings to the froala WYSIWYG editor.

## Installation

1. Clone this repo or download the zip.
2. Run `bower install` or Download the editor from [http://froala.com/wysiwyg-editor/](http://froala.com/wysiwyg-editor/) and jQuery
3. Load Froala WYSIWYG editor, jQuery and the angular-froala files into your project
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
View a list of all the options available in the [docs](http://froala.com/wysiwyg-editor/docs/options)

###Methods

To use the methods available, access the editor instance from your froalaOptions object `$scope.options.froala(method)` and use it as described in the [method docs](http://froala.com/wysiwyg-editor/docs/methods). example:

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
 Events can be used one of two ways as an attribute on the directive, or passed in with the options.
####Attribute
_app.js_

```js
$scope.editorOnFocus = function(e, editor){
	//Do Something
}
```
_view.html_

```html
<textarea froala="froalaOptions" ngModel="myHtml" froala-event-focus="editorOnFocus"></textarea>
```
###options
_app.js_

```js
$scope.froalaOptions = {
	inlineMode: false,
	placeholder: "Edit Me",
	events : {
		focus : function(e, editor) {/* ... */}
	}
```


###Displaying Html

Using `ng-bind-html` will render your html on the page but the default angular-sanitize.js will strip out all style tags. Remedy this by including `froala-sanitize.js` instead. example: `<div ng-bind-html="myHtml"></div>`

Congrats all is done!

## License

The `angular-froala` project is under MIT license.

Froala Editor has [3 different licenses](http://froala.com/wysiwyg-editor/pricing) for commercial use.
For details please see [License Agreement](http://froala.com/wysiwyg-editor/terms).