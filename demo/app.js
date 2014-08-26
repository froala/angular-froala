	// create the module and name it myApp
	var myApp = angular.module('myApp', ['ngSanitize', 'da.froala']).
		value('froalaConfig', {
			inlineMode: false
		});

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope, $timeout) {
		$scope.options = {
			borderColor: '#0000ff',
			disableRightClick : true,
			placeholder : 'My Placeholder'
		};

		$scope.froalaAction = function(action){
			$scope.options.froala(action);
		};
	});
