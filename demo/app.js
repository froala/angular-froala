	// add the module with global defaults for froala
	var myApp = angular.module('myApp', ['ngSanitize', 'froala']).
		value('froalaConfig', {
			toolbarInline: false,
			placeholderText: "Edit Your Content Here!"
		});

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope) {

		$scope.titleOptions = {
			placeholderText : 'Add a Title',
			charCounterCount: false,
			toolbarInline: true
		};

		$scope.myTitle = '<h1><span style="font-size: 36px;"><span style="font-family: Verdana,Geneva,sans-serif;">My Document\'s Title</span></span></h1>';
		$scope.myHtml = "";

	});
