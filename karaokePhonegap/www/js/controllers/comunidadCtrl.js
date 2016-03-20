'use strict';

// ******** CONTROLLERS DEL MAIN COMUNIDAD**** ////
app.controller('comunidadCtrl', function ($scope, $http, $modal,comunidadService,sessionService,$location,$window) {
	$scope.lanzarModal = function (controllador,path){
        var modalInstance = $modal.open({
            templateUrl: path,
            controller: controllador,
            backdrop: false,
            size: 'sm' ,
            windowClass: 'xx-dialog'
        });
        modalInstance.result.then(function(selectedItem){
            if ($scope.nuevoCliente.id_cliente == '-1')
                $window.location.reload();
        });
	}

	comunidadService.getUserBD(sessionService.get("id")).then(function(user){
		$scope.myUser3=user.data[0];
		$scope.myUser3.url_foto= path+$scope.myUser3.url_foto;
	});

	$scope.goTo=function(url){
		if (url=='/menu/comunidad/muroComunidad'){
			sessionService.set("id_selected",sessionService.get('id'));
		}
		if (url == $location.path())
			$window.location.reload();
		else
			$location.path(url);
	}

	$scope.swipeLeft=function(){
		console.log("swipeLeft");
	}

	$scope.swipeRight=function(){
		console.log("swipeRight");
	}

});

////////////////////////////////////////////////////////////
// ******** CONTROLLER DE LA ACTIVIDAD DE AMIGOS ******** //
////////////////////////////////////////////////////////////
app.controller('actividadComunidadCtrl', function ($scope, $http, comunidadService, sessionService, $q) {
	var friends2,friendsfriends2;


    var init = function(){
    	var actividadFriends = comunidadService.getActividadFriendsBD(),
    		friends = comunidadService.getFriendsBD(sessionService.get("id")),
    		grabacionesFriends = comunidadService.getGrabacionesFriendsBD(),
    		torneos = comunidadService.getTorneosBD(),
    		friendsFriends = comunidadService.getFriendsFriendsBD(),
    		desafiosFriends = comunidadService.getDesafiosFriendsBD(),
    		user = comunidadService.getUserBD(sessionService.get("id")),
    		songs = comunidadService.getSongsBD();
    	//GESTIONO TODOS LOS PROMISES CON $q
    	$q.all([actividadFriends,friends,grabacionesFriends,torneos,friendsFriends,desafiosFriends,user,songs]).then(function(dataArray){
    			$scope.Actividades = comunidadService.makeActividadesShow(dataArray[0].data,dataArray[1].data,dataArray[2].data,dataArray[3].data,dataArray[4].data,dataArray[5].data,dataArray[6].data,dataArray[7].data);
    			friends2=dataArray[1].data;
    			friendsfriends2=dataArray[4].data;
    	})
    }

	init();

	$scope.goTo=function(id_user){
		var esFriend=false;
		var aux={};
		aux.extraDesc="";
		for (var i=0; i<friends2.length;i++){
			if (friends2[i].id_user==id_user){
				esFriend=true;
				aux=friends2[i];
			}
		}
		if (!esFriend){
			for (var i=0; i<friendsfriends2.length;i++){
				if (friendsfriends2[i].id_user==id_user){
					aux=friendsfriends2[i];
				}
			}
		}
		if (esFriend)
			aux.extraDesc="Dejar de seguir";
		else
			aux.extraDesc="Seguir";

		comunidadService.modalUser(aux);
	}

	var semaforo=-1;
	$scope.getComentarios=function(id_post){
		if (semaforo!=id_post){
			semaforo=id_post;
			$scope.comentarios=[];
			var comentarios = comunidadService.getComentariosBD(id_post),
				users = comunidadService.getUsersBD();
			$q.all([comentarios,users]).then(function(dataArray){
				$scope.comentarios= dataArray[0].data;
				var arrayUsers = dataArray[1].data;
				for (var i=0; i<$scope.comentarios.length;i++){
					for (var j=0; j<arrayUsers.length;j++){
						if (parseInt($scope.comentarios[i].id_user) == parseInt(arrayUsers[j].id_user)){
							$scope.comentarios[i].username = arrayUsers[j].username;
							$scope.comentarios[i].url_foto = path+arrayUsers[j].url_foto;
							j=arrayUsers.length+1;
						}
					}
				}
			})
		}
	}

	$scope.setComentario = function(id_post){
		var idInput="#"+id_post;
		if ($(idInput).val() == "")
			alert("No puedes hacer comentarios en blanco");
		else {
			comunidadService.setComentarioBD(id_post,$(idInput).val()).then(function(data){
				semaforo=-1;
				$scope.getComentarios(id_post);
				$(idInput).val("");
			})
		}
	}
	
});


///////////////////////////////////////////////
// ******** CONTROLLER DE LOS MUROS ******** //
///////////////////////////////////////////////
app.controller('muroComunidadCtrl', function ($scope, $http, comunidadService, sessionService, $q) {
	var friends2,friendsfriends2;
	var init = function(){
		var id_user = sessionService.get("id_selected");
		var actividad = comunidadService.getActividadBD(id_user),
			friends = comunidadService.getFriendsBD(id_user),
			grabaciones = comunidadService.getGrabacionesBD(id_user),
			torneos = comunidadService.getTorneosBD(),
			desafios = comunidadService.getDesafiosBD(id_user),
			user = comunidadService.getUserBD(id_user),
			followers = comunidadService.getFollowersBD(id_user),
			songs = comunidadService.getSongsBD();
		$q.all([actividad,friends,grabaciones,torneos,desafios,user,followers,songs]).then(function(dataArray){
			$scope.Actividades = comunidadService.makeMuroShow(dataArray[0].data,dataArray[1].data,dataArray[2].data,dataArray[3].data,dataArray[4].data,dataArray[5].data,dataArray[6].data,dataArray[7].data);
			var user = dataArray[5].data;
			if (parseInt(user[0].id_user) == parseInt(sessionService.get("id")))
				$scope.mensajeMuro = "Mi Muro";
			else
				$scope.mensajeMuro = "Muro de "+user[0].username;

			friends2=dataArray[1].data;
			friendsfriends2=dataArray[6].data;
		})
	}

	init();


	$scope.goTo=function(id_user){
		var esFriend=false;
		var aux={};
		aux.extraDesc="";
		for (var i=0; i<friends2.length;i++){
			if (friends2[i].id_user==id_user){
				esFriend=true;
				aux=friends2[i];
			}
		}
		if (!esFriend){
			for (var i=0; i<friendsfriends2.length;i++){
				if (friendsfriends2[i].id_user==id_user){
					aux=friendsfriends2[i];
				}
			}
		}
		if (esFriend)
			aux.extraDesc="Dejar de seguir";
		else
			aux.extraDesc="Seguir";

		comunidadService.modalUser(aux);
	}

	var semaforo=-1;
	$scope.getComentarios=function(id_post){
		if (semaforo!=id_post){
			semaforo=id_post;
			$scope.comentarios=[];
			var comentarios = comunidadService.getComentariosBD(id_post),
				users = comunidadService.getUsersBD();
			$q.all([comentarios,users]).then(function(dataArray){
				$scope.comentarios= dataArray[0].data;
				var arrayUsers = dataArray[1].data;
				for (var i=0; i<$scope.comentarios.length;i++){
					for (var j=0; j<arrayUsers.length;j++){
						if (parseInt($scope.comentarios[i].id_user) == parseInt(arrayUsers[j].id_user)){
							$scope.comentarios[i].username = arrayUsers[j].username;
							$scope.comentarios[i].url_foto = path+arrayUsers[j].url_foto;
							j=arrayUsers.length+1;
						}
					}
				}
			})
		}
	}

	$scope.setComentario = function(id_post){
		var idInput="#"+id_post;
		if ($(idInput).val() == "")
			alert("No puedes hacer comentarios en blanco");
		else {
			comunidadService.setComentarioBD(id_post,$(idInput).val()).then(function(data){
				semaforo=-1;
				$scope.getComentarios(id_post);
				$(idInput).val("");
			})
		}
	}
	
});



/////////////////////////////////////////////
// ******** CONTROLLER DEL PERFIL ******** //
/////////////////////////////////////////////
app.controller('perfilComunidadCtrl', function ($scope, $http,comunidadService, sessionService) {
	
	comunidadService.getUserBD(sessionService.get("id")).then(function(user){
		var myUser2 = user.data;
		$scope.myUser=myUser2[0];
		$scope.myUser.fech_nac=new Date($scope.myUser.fech_nac);
	});

	$scope.editar=function(op){
		switch (op){
			case 0:
					if ($scope.nombreCheck==true){
						$scope.nombreCheck=false;
						$scope.nombreSRC = "glyphicon-floppy-saved";
					}
					else{
						update();
					}
				break;
			case 1:
					if ($scope.dateCheck==true){
						$scope.dateCheck=false;
						$scope.dateSRC = "glyphicon-floppy-saved";
					}
					else{
						update();
					}
				break;	
			case 3:
					if ($scope.ciudadCheck==true){
						$scope.ciudadCheck=false;
						$scope.ciudadSRC = "glyphicon-floppy-saved";
					}
					else{
						update();
					}
				break;
			case 2:
					if ($scope.paisCheck==true){
						$scope.paisCheck=false;
						$scope.paisSRC = "glyphicon-floppy-saved";
					}
					else{
						update();
					}
				break;
		}
	}

	var update=function(){
		comunidadService.updateUserBD($scope.myUser).then(function(objeto){
			alert("Cambios Realizados con Exito");
			changeAllEdit();
		});
	}

	var changeAllEdit= function(){
		$scope.paisSRC = "glyphicon-edit";
		$scope.ciudadSRC = "glyphicon-edit";
		$scope.paisCheck=true;
		$scope.ciudadCheck=true;
		$scope.dateCheck=true;
		$scope.dateSRC = "glyphicon-edit";
		$scope.nombreCheck=true;
		$scope.nombreSRC = "glyphicon-edit";
	}

	changeAllEdit();
});



/////////////////////////////////////////////////////////
// ******** CONTROLLER DE LA SECCION USUARIOS ******** //
/////////////////////////////////////////////////////////
app.controller('usuariosComunidadCtrl', function ($scope, $http, comunidadService, sessionService, $q) {
	//INICIALIZO VARIABLES//
	$scope.path = path;
    var usersTOTAL=[]; // array donde recojo todos los users
	$scope.users=[]; //array en el scope donde voy cargando los usuarios que se van a mostrar
	$scope.showCheck= true; // booleano para mostrar "+ usuarios" mientras queden mas
	var numTotal = 0;    //total de mostrados, inicialemente a 0 ""NO TOCAR""
	$scope.numShow = 4;  //******** Modificar para cambiar el numero por cada "pagina"*********//

    $scope.showMore = function(){
    	numTotal += $scope.numShow;
    	for (var i=numTotal-$scope.numShow; i< numTotal && i< usersTOTAL.length;i++)
    		$scope.users.push(usersTOTAL[i]);
    	if (numTotal>=usersTOTAL.length)
			$scope.showCheck=false;
    }

    var init = function(){
    	var users = comunidadService.getUsersBD(),
    		friends = comunidadService.getFriendsBD(sessionService.get('id'));
    	$q.all([users,friends]).then(function(dataArray){
			usersTOTAL = comunidadService.makeUsers(dataArray[0].data,dataArray[1].data); //pasa a la funcion users y friends, para que me devuelva el array resultante
            $scope.showMore(); //llamo al paginador
    	});
    }

    init();

	$scope.goTo=function(user){
		comunidadService.modalUser(user);
	}

    $scope.mensaje = function(user){
    	userGlobal=user;
    	comunidadService.smsUser();
    }

    $scope.editFollow = function(follower){
    	if (follower.extraDesc=="Dejar de seguir"){ //si eres seguidor...
	    	if (confirm("Quieres dejar de seguir a "+follower.username+"?")){
	    		comunidadService.deleteFollowBD(follower.id_user).then(function(){
	    			follower.extraDesc="Seguir";
	    		});
	    	}
	    }else
	    	if (confirm("Quieres seguir a "+follower.username+"?")){
	    		comunidadService.setFollowBD(follower.id_user).then(function(){
	    			follower.extraDesc="Dejar de seguir";
	    		});
	    	}
    }
});




////////////////////////////////////////////////////
// ******** CONTROLLER DEL CONFIGURACION ******** //
////////////////////////////////////////////////////
app.controller('configuracionComunidadCtrl', function ($scope, $http) {
	console.log("configuracionComunidadCtrl");

	
});








///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// ******** CONTROLLERS DE LOS MODALS **** ////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////
// ******** CONTROLLERS DE SIGUIENDO ***** ////
///////////////////////////////////////////////
app.controller('siguiendoModalComunidadCtrl', function ($scope, $http, $modalInstance, comunidadService, sessionService) {

	$scope.close= function(){
        $modalInstance.dismiss('cancel');
    }
	$scope.path = path;

    var init = function(){
		$scope.followers=[];
	    comunidadService.getFriendsBD(sessionService.get('id')).then(function(friends){
	    	$scope.friends = friends.data;
	    	for (var i=0; i<$scope.friends.length ; i++)
	    		if ($scope.friends[i].id_user == 0)
	    			$scope.friends[i].extra=true;
	    });
    }

    $scope.quitFollow = function(friend){
    	if (confirm("Quieres dejar de seguir a "+friend.username+"?")){
    		comunidadService.deleteFollowBD(friend.id_user).then(function(){
    			init();
    		});
    	}
    }

    $scope.mensaje = function(friend){
    	userGlobal=friend;
    	comunidadService.smsUser();
    }

	$scope.goTo=function(user){
		user.extraDesc="Dejar de seguir";
		comunidadService.modalUser(user);
	}

    init();
	
});


////////////////////////////////////////////////
// ******** CONTROLLERS DE SEGUIDORES ***** ////
////////////////////////////////////////////////
app.controller('seguidoresModalComunidadCtrl', function ($scope, $http, $modalInstance, comunidadService, sessionService, $q) {

	$scope.close= function(){
        $modalInstance.dismiss('cancel');
    }

	$scope.path = path;
	$scope.followers=[];

	var init = function(){
		var followers = comunidadService.getFollowersBD(sessionService.get('id')),
			friends = comunidadService.getFriendsBD(sessionService.get('id'));
		$q.all([followers,friends]).then(function(dataArray){
			$scope.followers = comunidadService.makeSeguidores(dataArray[0].data,dataArray[1].data);
		})
	}

    init();

    $scope.editFollow = function(follower){
    	if (follower.extra){  //si eres seguidor...
	    	if (confirm("Quieres dejar de seguir a "+follower.username+"?")){
	    		comunidadService.deleteFollowBD(follower.id_user).then(function(){
	    			init();
	    		});
	    	}
	    }
	    else{
	    	if (confirm("Quieres seguir a "+follower.username+"?")){
	    		comunidadService.setFollowBD(follower.id_user).then(function(){
	    			init();
	    		});
	    	}
	    }
    }

    $scope.mensaje = function(follower){
    	userGlobal=follower;
    	comunidadService.smsUser();
    }

	$scope.goTo=function(user){
		comunidadService.modalUser(user);
	}
	
});




////////////////////////////////////////////////////
// ******** CONTROLLER DE NOTIFIACIONES  ******** //
////////////////////////////////////////////////////
app.controller('notificacionesModalComunidadCtrl', function ($scope, $http, $modalInstance) {
	console.log("notificacionesModalComunidadCtrl");

	$scope.close= function(){
        $modalInstance.dismiss('cancel');
    }
	
});




////////////////////////////////////////////////////
// ******** CONTROLLER DE MENSAJESMODAL  ******** //
////////////////////////////////////////////////////
app.controller('mensajesModalComunidadCtrl', function ($scope, $http, $modalInstance, $modal,comunidadService, sessionService,$q) {
	$scope.path = path;

	$scope.close= function(){
        $modalInstance.dismiss('cancel');
    }

    $scope.lanzarModal = function (user2){
		userGlobal=user2;
		comunidadService.smsUser();
	}

	var init= function(){
		var id=sessionService.get('id');
		var mensajesRecepter = comunidadService.getLastMensajesRecepterBD(),
			mensajesSender = comunidadService.getLastMensajesSenderBD(),
    		users = comunidadService.getUsersBD();
    	$q.all([mensajesRecepter,users,mensajesSender]).then(function(dataArray){
			$scope.mensajes = [];
			var recepter=dataArray[0].data; 
			var sender = dataArray[2].data;
			users = dataArray[1].data;

            for (var i=0; i<recepter.length; i++){
            	var check=false;
            	for (var j=0; j<sender.length; j++){
            		if (recepter[i].id_sender == sender[j].id_recepter){
            			check=true;
            			if (recepter[i].id_mensaje > sender[j].id_mensaje)
            				$scope.mensajes.push(recepter[i]);
            			else
            				$scope.mensajes.push(sender[j]);
            			sender.splice(j,1);
            			j=sender.length+6;
            		}
            	}
            	if (!check){
            		$scope.mensajes.push(recepter[i]);
            	}
            }
            for (var i=0; i<sender.length; i++)
            	$scope.mensajes.push(sender[i]);

            for (var i=0; i<$scope.mensajes.length; i++){
            	for (var j=0; j<users.length;j++){
            		if (parseInt($scope.mensajes[i].id_recepter)==parseInt(id)){
            			if ($scope.mensajes[i].id_sender==users[j].id_user){
            				$scope.mensajes[i].user2=users[j];
            				$scope.mensajes[i].contenido = "Tu: "+$scope.mensajes[i].contenido;
            				j=users.length+1;
            			}
            		}
            		else{
            			if ($scope.mensajes[i].id_recepter==users[j].id_user){
            				$scope.mensajes[i].user2=users[j];
            				j=users.length+1;
            			}
            		
            		}
            	}
            }
    	});
	}

	init();
	
});


//xxxxx

///////////////////////////////////////////////////////
// ******** CONTROLLER DE CONVERSACIONMODAL ******** //
///////////////////////////////////////////////////////
app.controller('conversacionModalComunidadCtrl', function ($scope, $http, $modalInstance,comunidadService) {
	$scope.textChat;
	$scope.user2 = userGlobal;

	$scope.close= function(){
        $modalInstance.dismiss('cancel');
    }

    var init = function(){
    	comunidadService.getMensajesbyIdBD().then(function(mensajes){
    		$scope.mensajes = mensajes.data;
    		for (var i=0;i<$scope.mensajes.length;i++){
    			if ($scope.mensajes[i].id_sender == userGlobal.id_user)
    				$scope.mensajes[i].tipo = "conversTu";
    			else
    				$scope.mensajes[i].tipo = "conversEl";
    		}
    	})
    }

    $scope.sendChat = function(){
    	console.log("enviado...");
    	console.log($scope.textChat);
    	comunidadService.sendMensajeBD($scope.textChat).then(function(){
    		init();
    		$scope.textChat="";
    	})
    }
	
	init();
});




//////////////////////////////////////////////
//*************** MODAL FOTO ***************//
//////////////////////////////////////////////
app.controller('cambiarFotoModalComunidadCtrl', function ($scope, $http, $modalInstance,comunidadService,sessionService,$window) {
    var foto = new Media();
	$scope.close= function(){
        $modalInstance.dismiss('cancel');
    }

    comunidadService.getUserBD(sessionService.get("id")).then(function(user){
		$scope.myUser3=user.data[0];
		$scope.myUser3.url_foto= path+$scope.myUser3.url_foto;
	});

	$scope.uploadFile = function(files) {
	    var fd = new FormData();
	    fd.append("imgToUpload", files[0]);
	    fd.append("value1",parseInt(sessionService.get('id')));
	    fd.append("value2",sessionService.get('token'));
	    $http.post(path+"updateFoto.php", fd, {
	        withCredentials: false,
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    }).then(function(msg){
	    	if (msg.data=="true"){
	    		$window.location.reload();
	    		alert("Foto Actualizada");
	    	}
    	});
	};

	    $scope.takeFoto = function() {
            navigator.camera.getPicture(uploadPhoto, function(message) {
			alert('get picture failed');
		},{
			quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            cameraDirection: 1
		}
            );
 
        }
 
        function uploadPhoto(imageURI) {
            var options = new FileUploadOptions();
            options.fileKey="imgToUpload";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
 
            var params = new Object();
            params.value1 = parseInt(sessionService.get('id'));
        	params.value2 = sessionService.get('token');
 
            options.params = params;
            options.chunkedMode = false;
 
            var ft = new FileTransfer();
            ft.upload(imageURI, path + "updateFoto.php", win, fail, options);
        }
 
        function win(r) {
            //console.log("Code = " + r.responseCode);
            //console.log("Response = " + r.response);
            //console.log("Sent = " + r.bytesSent);
            if (r.response=="true"){
	    		$window.location.reload();
	    		alert("Foto Actualizada");
	    	}
        }
 
        function fail(error) {
            alert("An error has occurred: Code = " + error.code);
        }

});



////////////////////////////////////////////////
// ******** CONTROLLER DE USER MODAL ******** //
////////////////////////////////////////////////
app.controller('userModalCtrl', function ($scope, $http, $modalInstance,$modalStack,comunidadService,$window,grabacionesService,$location) {
	$scope.user=userGlobal;
	$scope.path = path;
    console.log($scope.user);

	var refrescar=false;
	$scope.close= function(){
        $modalInstance.dismiss('cancel');
        if (refrescar)
        	$window.location.reload();
    }

    $scope.goToMuro = function(){
    	comunidadService.goToMuroUser($scope.user.id_user);
    	//$window.location.reload();
    	$modalStack.dismissAll('all');
    	//$modalInstance.dismiss('cancel');
    }

    $scope.retar = function(){
    	alert("OPCION AUN NO DISPONIBLE");
    }

    $scope.mensaje = function(){
    	comunidadService.smsUser();
    }


    $scope.goToGrabaciones = function(){
    	var search={};
    	search.id_user=$scope.user.id_user;
    	grabacionesService.setFilter(search);
        
    	$location.path('/menu/grabaciones');
    	
    	//$modalInstance.dismiss('cancel');
        
        $modalStack.dismissAll('all');
        //$window.location.reload();
    	//$modalInstance.dismiss('cancel');
    }
	


    $scope.editFollow = function(follower){
    	refrescar=true;
    	if (follower.extraDesc=="Dejar de seguir"){ //si eres seguidor...
	    	if (confirm("Quieres dejar de seguir a "+follower.username+"?")){
	    		comunidadService.deleteFollowBD(follower.id_user).then(function(){
	    			follower.extraDesc="Seguir";
	    		});
	    	}
	    }else
	    	if (confirm("Quieres seguir a "+follower.username+"?")){
	    		comunidadService.setFollowBD(follower.id_user).then(function(){
	    			follower.extraDesc="Dejar de seguir";
	    		});
	    	}
    }
});