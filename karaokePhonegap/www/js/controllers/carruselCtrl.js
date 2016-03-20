'use strict';

app.controller('carruselCtrl', function ($scope, $http) {
	console.log("carrusel");
});

app.controller('torneosCtrl', function ($scope, $http) {
	console.log("torneos");

	$scope.test = function(){
		alert("test desde torneos");
	}
});




app.controller('estrellaCtrl', function ($scope, $http) {
	console.log("estrella");
});




app.controller('desafioCtrl', function ($scope, $http) {
	console.log("desafio");
});