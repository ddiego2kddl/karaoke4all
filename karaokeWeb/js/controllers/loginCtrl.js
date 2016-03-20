'use strict';

app.controller('loginCtrl', function($scope,loginService){
	$scope.login=function(user){
		loginService.login(user); // call login service
	}

	$scope.registrar = function(newUser){
		if (newUser.password != newUser.passwordd)
			alert("las contraseñas no coinciden");
		else{
			loginService.register(newUser);
		}
	}

	$scope.acceptTerminos=true;

	$scope.aceptar= function(){
		if ($scope.acceptTerminos==false)
			$scope.acceptTerminos=true;
		else
			$scope.acceptTerminos=false;
	}

});