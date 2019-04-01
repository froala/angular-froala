	// add the module with global defaults for froalaz
	define(["jquery","froala_editor","angular","angularroute","angular-froala","angularresource"], function($,a,b,c,d,e) {

		var myApp = angular.module('myApp', ['froala']).
		value('froalaConfig', {
			toolbarInline: false,
			placeholderText: 'Edit Your Content Here!'
		});
	
		// create the controller and inject Angular's $scope
		myApp.controller('mainController', function($scope) {
	
			$scope.titleOptions = {
				placeholderText: 'Add a Title',
				charCounterCount: false,
				toolbarInline: true,
				events: {
					'froalaEditor.initialized': function() {
						console.log('initialized');
					}
				}
			};
			$scope.sample="";
			$scope.initialize = function(initControls) {
				$scope.initControls = initControls;
				$scope.deleteAll = function() {
					initControls.getEditor()('html.set', '');
				};
			};
		});
		angular.element().ready(function() {
			// bootstrap the app manually
			angular.bootstrap(document, ['myApp']);
		});
		})