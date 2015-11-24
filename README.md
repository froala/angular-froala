# angular-froala
>angular-froala provides AngularJS bindings to the froala WYSIWYG editor VERSION 2.

##Version 2
This repository contains bindings for the latest version of the Froala Editor (version 2). Checkout the `V1` branch for support of Version 1 of the editor.


## Installation

1. Clone this repo or download the zip.

2. Run `bower install` or Download the editor from [https://www.froala.com/wysiwyg-editor/](https://www.froala.com/wysiwyg-editor/) and jQuery

3. Load Froala WYSIWYG editor (and all desired plugins), jQuery and the angular-froala files into your project
	- src/angular-froala.js
	- src/froala-sanitize.js

## Usage

1. Add the `froala` dependency to your Angular project. example:
	* `angular.module('myApp', ['froala'])`
2. Create a textarea with the froala directive in your view and give it a model, where `myHtml` is a variable on `$scope`.
	* `<textarea froala ng-model="myHtml"></textarea> `

###Options

**Setting Defaults**: to set defaults for the editor pass a config object to angular.value with the key `froalaConfig` like this:
```javascript
angular.module('myApp', ['froala']).
	value('froalaConfig', {
		toolbarInline: false,
		placeholderText: 'Enter Text Here'
	});
```

**From the Controller**: to set options from the controller, create an options object on scope and simply pass it to the froala directive. example:

_app.js_

```javascript
function myCtrl($scope){
	$scope.myHtml = "<h1>Hello World</h1>"
	$scope.froalaOptions = {
		toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"]
	}
}
```
_view.html_

```html
<textarea froala="froalaOptions" ngModel="myHtml"></textarea>
```
View a list of all the options available in the [docs](https://www.froala.com/wysiwyg-editor/docs/options)

###Methods

To use the methods available, access the editor instance from your froalaOptions object `$scope.options.froalaEditor(method)` and use it as described in the [method docs](http://froala.com/wysiwyg-editor/docs/methods). example:

```javascript
function myCtrl($scope){
	$scope.myHtml = "";
	$scope.froalaOptions = {
		toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"]
	}

//Use the methods like this
$scope.froalaOptions.froalaEditor("selection.get");
```
###Events
 Events can be passed in with the options, with a key events and object where the key is the event name and the value is the callback function.
####Attribute
_app.js_
```js
$scope.froalaOptions = {
	placeholder: "Edit Me",
	events : {
		'froalaEditor.focus' : function(e, editor) {/* ... */}
	}
```


###Displaying Html

Using `ng-bind-html` will render your html on the page but the default angular-sanitize.js will strip out all style tags. Remedy this by including `froala-sanitize.js` instead. example: `<div class="fr-view" ng-bind-html="myHtml"></div>`

Congrats all is done!

## License

The `angular-froala` project is under MIT license. However, in order to use Froala WYSIWYG HTML Editor plugin you should purchase a license for it.

Froala Editor has [3 different licenses](http://froala.com/wysiwyg-editor/pricing) for commercial use.
For details please see [License Agreement](http://froala.com/wysiwyg-editor/terms).
