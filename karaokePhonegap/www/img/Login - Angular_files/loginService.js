'use strict'

app.factory('loginService', function($http,$location,sessionService,$rootScope){
	return{
		login:function(user){
			var $promise = $http.post('data/user.php',user); // send data to user php
			$promise.then(function(msg){
				var aux = msg.data.split('_');
				$rootScope.cargo=aux[0];
				var uid= msg.data;

				if (uid) {
					//console.log('succes login');
					sessionService.set('uid',uid);
					$location.path('/menu/equipos');

				}
				else {
					//console.log('fail login');
					$location.path('/login');
				}
			});
		},
		logout:function(){
			if (confirm("Quieres Salir??")){
				sessionService.destroy('uid');
				$location.path('/login');
			}
		},
		islogged:function(){
			var $checkSessionServer=$http.post('data/check_session.php');
			return $checkSessionServer;
		}
		
	};
});