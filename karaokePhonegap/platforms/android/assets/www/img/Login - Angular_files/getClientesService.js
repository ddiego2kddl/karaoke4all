'use strict';

app.service('getClientesService', function($http,$q){
	
	var deferred = $q.defer();
	$http.get('data/getClientes.php').then(function(data){
		deferred.resolve(data);
	});

	this.getClientes = function(){
		return deferred.promise;
	}
});