'use strict';

app.controller('menuCtrl', ['$scope','loginService','$http', function($scope,loginService,$http){
	console.log("start");
	$scope.txt="Menu";

	$scope.logout=function(){
		loginService.logout();
	};

	$scope.msg='hola';
	$scope.test = function(){
        var aux = {"email":"d@d.d", "password":"d"};
		$http.post('http://54.77.53.92/futbol/data/user.php',aux).
        //$http.post('http://karaoke4all.es/api/user/checkUser.php',aux).
            success(function(data, status, headers, config) {
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
        });
	}

	$scope.equipos= [];
	$http.post('http://karaoke4all.es/api/user/checkUser.php').then(function(data){
        console.log(data.data);
        $scope.equipos=data.data;
    });


    $scope.newEquipo=[];
    $scope.insertarEquipo= function(){
    	$scope.newEquipo.victorias=0;
    	$scope.newEquipo.empates=0;
    	$scope.newEquipo.perdidos=0;
    	var newEquipo =  new EquipoObject($scope.newEquipo); 
        console.log(newEquipo);
    	$http.post('data/setEquipo.php',newEquipo).
			success(function(data, status, headers, config) {
			    console.log(data);
		  	}).
		 	error(function(data, status, headers, config) {
			    console.log(data);
    	});
    };

    function EquipoObject (newEquipo){
    	this.nombre = newEquipo.nombre;
    	this.victorias = newEquipo.victorias;
    	this.perdidos = newEquipo.perdidos;
    	this.empates = newEquipo.empates;
    	this.id_admin = newEquipo.id_admin;
    }

}]);