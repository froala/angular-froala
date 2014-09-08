	// create the module with global defaults for froala
	var myApp = angular.module('myApp', ['ngSanitize', 'da.froala']).
		value('froalaConfig', {
			inlineMode: false
		});

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope) {
		$scope.options = {
			placeholder : 'My Placeholder',
		};

		$scope.froalaAction = function(action){
			$scope.options.froala(action);
		};

	});
