'use strict';

app.controller('loginCtrl', function($scope,loginService){
	$scope.login=function(user){
		loginService.login(user); // call login service
	}

});