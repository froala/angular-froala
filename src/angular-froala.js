angular.module('froala', []).
	value('froalaConfig', {}).
	directive('froala', ['froalaConfig', '$timeout', function(froalaConfig, $timeout) {
		"use strict"; //Scope strict mode to only this directive
		froalaConfig = froalaConfig || {};
		var generatedIds = 0;

		var scope = {
			froalaOptions : '=froala'
		};

		return {
			restrict: 'A',
			require: 'ngModel',
			scope: scope,
			link: function(scope, element, attrs, ngModel) {

				var ctrl = {};

				ctrl.init = function () {
					ctrl.options = angular.extend({}, froalaConfig, scope.froalaOptions);
					ctrl.listeningEvents = ["keyup", 'froalaEditor'];
	        if (!attrs.id) {
	        	// generate an ID if not present
	          attrs.$set('id', 'froala-' + generatedIds++);
	        }

	        //Register events provided in the options
	        for(var eventName in ctrl.options.events){
	        	if (ctrl.options.events.hasOwnProperty(eventName)) {
	        		ctrl.registerEventsWithCallbacks(eventName, ctrl.options.events[eventName]);
	        	}
	        }

	        //init the editor
	        ctrl.froalaEditor = element.froalaEditor(ctrl.options).data('froala.editor').$el;
	        ctrl.initListeners();

	        //assign the froala instance to the options object to make methods available in parent scope
	        if(scope.froalaOptions){
	        	scope.froalaOptions.froalaEditor = angular.bind(element, jQuery(attrs.id).froalaEditor);
	        }

	        //Instruct ngModel how to update the froala editor
	        ngModel.$render = function(){
	        	element.froalaEditor('html.set', ngModel.$viewValue || '', true);
	        	//This will reset the undo stack everytime the model changes externally. Can we fix this?
	        	element.froalaEditor('undo.reset');
	        };

	        ngModel.$isEmpty = function (value) {
	        	var isEmpty = jQuery(jQuery.parseHTML(value)).text().trim().length <= 0;
	        	return isEmpty;
	        };
				};

				ctrl.initListeners = function () {
					ctrl.froalaEditor.on('keyup', function(e){
						ctrl.updateModelView();
					});

					element.on('froalaEditor.contentChanged', function (e, editor) {
						ctrl.updateModelView();
					});

					scope.$on('$destroy', function(){
						element.off(ctrl.listeningEvents.join(" "));
						element.froalaEditor('destroy');
					});
				};

				ctrl.updateModelView = function () {
					var returnedHtml = element.froalaEditor('html.get');
					if (angular.isString(returnedHtml)){
						ngModel.$setViewValue(returnedHtml);
					}
				};

				ctrl.registerEventsWithCallbacks = function (eventName, callback) {
					if(eventName && callback){
						ctrl.listeningEvents.push(eventName);
			  		element.on(eventName, callback);
			  	}
				};

				ctrl.init();
			}
		};
 }]);