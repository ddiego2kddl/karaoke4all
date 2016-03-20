'use strict';

app.controller('menuCtrl', ['$scope','loginService','comunidadService', function($scope,loginService,comunidadService){
	$scope.txt="Menu";

	$scope.logout=function(){
		loginService.logout();
	};

}]);