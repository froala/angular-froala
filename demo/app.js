var myApp = angular.module('app', ['froala']).value('froalaConfig', {
	placeholderText: 'Edit...',
  });
  
  myApp.controller('ctrl1', function($scope, $locale) {
	$scope.formOpen = false;
	$scope.content = {text: null};
  
	$scope.addContent = function (form) {
		  console.log("submit");
		  console.log($scope.content);
		  console.log(form);
	   
		  if (form) {
			  form.$setPristine();
			  form.$setUntouched();
		  }
		   $scope.content = angular.copy({});
		   $scope.formOpen = false;       
	}
  
  
	$scope.name = 'hello';
  
	$scope.myHtml = '<h1>Hello World</h1>';
  
	$scope.froalaOptions = {
					  key: '<%=ConfigurationSettings.AppSettings["FroalaKey"]%>',
					  enter: FroalaEditor.ENTER_BR,
					  autofocus: true,
					  attribution: false,
					  quickInsertEnabled: false,
					  immediateAngularModelUpdate: true,
					  events: {
						  'initialized': function () {
							  console.log('init')
						  },   
						  'destroy': function () {
							  console.log('destroy')
						  },                      
					  
					  }
				  };
  });
  