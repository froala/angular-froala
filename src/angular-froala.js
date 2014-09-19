'use strict';

angular.module('froala', []).
	value('froalaConfig', {}).
	directive('froala', ['froalaConfig', '$timeout', function(froalaConfig, $timeout) {
		froalaConfig = froalaConfig || {};
		var froalaInstances = {};
		var generatedIds = 0;
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				froala : '='
			},
			link: function(scope, element, attrs, ngModel) {
				if(!(element instanceof jQuery)){
					throw "Froala requires jQuery, are you loading it before Angular?";
				}

				var defaultOptions = {};
				var contentChangedCallback;
				var options = angular.extend(defaultOptions, froalaConfig, scope.froala);

				if(options.contentChangedCallback){
					contentChangedCallback = options.contentChangedCallback;
					delete options.contentChangedCallback;
				}

				// generate an ID if not present
        if (!attrs.id) {
          attrs.$set('id', 'froala-' + generatedIds++);
        }

				var updateView = function () {
					var returnedHtml = element.editable('getHTML');
					var theHTML;
					if(angular.isArray(returnedHtml) && angular.isString(returnedHtml[0])){
						theHTML = returnedHtml[0];
					}else if(angular.isString(returnedHtml)){
						theHTML = returnedHtml;
					}else{
						console.error('We recieved an unexpected format for the html');
						return;
					}

					ngModel.$setViewValue(theHTML);
					if (!scope.$root.$$phase) {
						scope.$apply();
					}
				};

				options.contentChangedCallback = function () {
					if(contentChangedCallback)
						contentChangedCallback();
					updateView();
				};

				ngModel.$render = function(){
					element.editable('setHTML', ngModel.$viewValue || '', false);
				};

				var froala = element.editable(options).data('fa.editable');

				froala.$element.on('blur keyup change', function(e){
					updateView();
				});

				// the froala instance to the options object to make methonds availble in parent scope
				if(scope.froala){
					scope.froala.froala = angular.bind(element, $(attrs.id).editable);
				}

				scope.$watch('froala', function(n, o){
					for (var key in n) {
						if (n.hasOwnProperty(key)) {
							if(n[key] != o[key]){
								element.editable('option', key, n[key]);
							}
						}
					}
				}, true);

				scope.$on('$destroy', function(){
					element.editable('destroy');
				});
			}
		};
 }]);