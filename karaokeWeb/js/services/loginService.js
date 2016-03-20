'use strict'

app.factory('loginService', function($http,$location,sessionService,$rootScope,comunidadService){
	return{
		login:function(user){
			console.log(user);
			var $promise = $http.post(path+'user.php',user); // send data to user php
			$promise.then(function(msg){
				var token= msg.data.split('/');
				if (token) {
					sessionService.set('token',token[0]);
					sessionService.set('id',token[1]);
					$location.path('/menu/carrusel');
				}
				else {
					console.log("fail login")
					$location.path('/login');
				}
			});
		},
		logout:function(){
			if (confirm("Quieres Salir??")){
				sessionService.destroy('token');
				sessionService.destroy('id');
				//navigator.app.exitApp();
				$location.path('/login');
			}
		},
		islogged:function(){
			var user= {"id":sessionService.get("id"),"token":sessionService.get("token")};
			var $checkSessionServer=$http.post(path+'check_login.php',user);
			return $checkSessionServer;
		},
		register:function(userNew){
			var $promise = $http.post(path+'register.php',userNew); // send data to user php
			$promise.then(function(msg){
				console.log("respuesta del servidor:"+msg.data);
				var token= msg.data.split('/');
				if (token) {
					sessionService.set('token',token[0]);
					sessionService.set('id',token[1]);
					$location.path('/menu/carrusel');
				}
				else {
					console.log("fail login");
					alert("email en uso");
				}
			});
		}
		
	};
});