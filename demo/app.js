	// add the module with global defaults for froala
	var myApp = angular.module('myApp', ['ngSanitize', 'froala']).
		value('froalaConfig', {
			inlineMode: false,
			events : {
				align : function(e, editor, alignment){
					console.log(alignment + ' aligned');
				}
			}
		});

	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope) {
		$scope.options = {
			placeholder : 'My Placeholder'
		};

		$scope.froalaAction = function(action){
			$scope.options.froala(action);
		};

		$scope.onPaste = function(e, editor, html){
			return 'Hijacked ' + html;
		}

		$scope.onEvent = function(e, editor, a, b){
			console.log('onEvent', e.namespace, a, b);
		}

	});
