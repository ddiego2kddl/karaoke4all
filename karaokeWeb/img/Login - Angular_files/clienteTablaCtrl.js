'use strict';

app.controller('clienteTablaCtrl', function(getClientesService, $scope, ngTableParams) {
    
        var promise = getClientesService.getClientes();
        promise.then(function(data){
            $scope.clientes=data.data;
            var aux=[];  
            aux=data.data;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
             }, {
                total: aux.length, // length of data
                getData: function($defer, params) {
                    console.log("paginando");
                    $defer.resolve(aux.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });

       
});