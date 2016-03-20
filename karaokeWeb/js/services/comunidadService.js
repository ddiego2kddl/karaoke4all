app.service('comunidadService', function($http,$q,sessionService,$location,$window,$modal){
	//********* TODAS LAS CANCIONES *********
    this.getSongsBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return $http.post(path+'getSongs.php',id);
    }   
    //********* TODAS LOS USERS *********
    this.getUsersBD = function(){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return  $http.post(path+'getUsers.php',id);
  
    }
    //********* TODOS LOS TORNEOS *********
    this.getTorneosBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return $http.post(path+'getTorneos.php',id);
    }
    //********* SELECCIONAR DATOS DEL USUARIO *********
    this.getUserBD = function(id_user){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_user":id_user};
        return $http.post(path+'getUser.php',id);
    }
    //********* GUARDAR DATOS USUARIO *********
    this.updateUserBD = function(user){
    	user.id=sessionService.get("id");
    	user.token=sessionService.get("token");
        return $http.post(path+'updateUser.php',user);
    }
    //**************************************** FUNCIONES PARA OBTENER MATERIAL PARA MUROS ***********************************//
    //********* FRIENDS *********
   this.getFriendsBD = function(id_user){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_user":id_user};
        return $http.post(path+'getFriends.php',id);
    }
    //********* FOLLOWERS *********
    this.getFollowersBD = function(id_user){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_user":id_user};
        return $http.post(path+'getFollowers.php',id);
    }
    //********* ACTIVIDADES *********
    this.getActividadBD = function(id_user){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_user":id_user};
        return $http.post(path+'getActividad.php',id);
    }
    //********* DESAFIOS *********
    this.getDesafiosBD = function(id_user){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_user":id_user};
        return $http.post(path+'getDesafios.php',id);
    }
    //********* GRABACIONES *********
    this.getGrabacionesBD = function(id_user){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_user":id_user};
        return $http.post(path+'getGrabaciones.php',id);
    }
    //**************************************** EXCLUSIVOS PARA LA SECCION DE ACTIVIAD ***********************************//
    //********* FRIENDSFRIENDS *********
    this.getFriendsFriendsBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return $http.post(path+'getFriendsFriends.php',id);
    }
    //********* GRABACIONES de FRIENDS *********
    this.getGrabacionesFriendsBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return $http.post(path+'getGrabacionesFriends.php',id);
    }
    //********* DESAFIOS de FRIENDS *********
    this.getDesafiosFriendsBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return $http.post(path+'getDesafiosFriends.php',id);
    }
	//********* ACTIVIDAD de FRIENDS *********
    this.getActividadFriendsBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return $http.post(path+'getActividadFriends.php',id);
    }

    //**************************************** ACCIONES DE INSERTADO Y ELIMINACION ***********************************//    
    //********* DEJAR DE SEGUIR A UN FRIEND *********
    this.deleteFollowBD = function(id_target){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_target":id_target};
        return $http.post(path+'deleteFollow.php',id);
    }
    //********* SEGUIR A UN USER *********
    this.setFollowBD = function(id_target){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_target":id_target};
        return $http.post(path+'setFollow.php',id);
    }     

    //*** CONSTRUCTOR DE CLASE ACTIVIDAD PARA MOSTRAR *****
    var Actividad = function(){
    	var actv={};
    	actv.nombreUser=""; //
    	actv.id_user=""; //
    	actv.url_foto=""; //
    	actv.descripcion="";//
    	actv.tipo="";//
    	actv.extra="";
    	actv.extra_id="";
    	actv.extra2="";
    	actv.extra2en="";
    	actv.extra2_id="";
    	actv.fecha="";
    	return actv;
    }
    this.Actividad =function(){
    	return Actividad();
    }

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////   FUNCIONES PARA SECCION MUROS   ////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
    this.makeMuroShow = function(actividadBD,friendsBD,grabacionesBD,torneosBD,desafiosBD,userBD,followersBD,songsBD){
    	muroShow= new Array();
    	friendsBD.push(userBD[0]); //añado el user al arrayFRIENDS para el caso de mensajes a mi
    	friendsBD= friendsBD.concat(followersBD); //añado los followers a friends, para mensajes de 3º sobre mi, como retos de mis followers
    	for (var i=0; i<actividadBD.length;i++){
    		muroShow.push(Actividad());
            muroShow[i].id_post = actividadBD[i].id_post;
    		muroShow[i].descripcion = actividadBD[i].comment;
    		muroShow[i].tipo = actividadBD[i].tipo;
    		muroShow[i].fecha = new Date(actividadBD[i].date);
    		muroShow[i].id_user = actividadBD[i].id_user;
    		//añado la info del user activo
    		if (muroShow[i].id_user == userBD[0].id_user){
    			muroShow[i].url_foto= path + userBD[0].url_foto;	//url_foto del usuario activo
	    		muroShow[i].nombreUser=userBD[0].username;	//Nombre del usuario activo
    		}
    		else{
	    		for (var j=0; j<friendsBD.length; j++){
	    			if (muroShow[i].id_user == friendsBD[j].id_user){
	    				muroShow[i].url_foto= path + friendsBD[j].url_foto;	//url_foto del usuario activo
	    				muroShow[i].nombreUser=friendsBD[j].username;	//Nombre del usuario activo
	    				j=friendsBD.length+1;
	    			}
	    		}
	    	}
    		switch(muroShow[i].tipo) {
			    case "grabacion":
			        for (var j=0;j<grabacionesBD.length; j++){
			        	if (actividadBD[i].id_grabacion==grabacionesBD[j].id_grabacion){
			        		muroShow[i].extra_id=grabacionesBD[j].id_grabacion;
			        		for (var m=0;m<songsBD.length; m++){
			        			if (grabacionesBD[j].id_song==songsBD[m].id_song){
			        				muroShow[i].extra=songsBD[m].title;
			        				m=songsBD.length+1;
			        			}
			        		}
			        		j=grabacionesBD.length+1;
			        	}
			        }
			        break;
			    case "song":
			        for (var j=0;j<songsBD.length; j++){
			        	if (actividadBD[i].id_song==songsBD[j].id_song){
			        		muroShow[i].extra=songsBD[j].title;
			        		muroShow[i].extra_id=songsBD[j].id_song;
			        		j=songsBD.length+1;
			        	}
			        }
			        break;
			    case "desafio":
			        for (var j=0; j<desafiosBD.length; j++){
			        	if (actividadBD[i].id_desafio == desafiosBD[j].id_desafio){ //busco el objeto desafio con el id_desafio
			        		for (var m=0; m<friendsBD.length; m++){ 
			        			if (desafiosBD[j].id_user2 == friendsBD[m].id_user){ //busco el user2 del desafio en la lista de "friendsfriendsBD"
			        				muroShow[i].extra = friendsBD[m].username;
			        				muroShow[i].extra_id = friendsBD[m].id_user;
			        				m=friendsBD.length+1;
			        			}
			        		}
			        		for (var m=0; m<songsBD.length; m++){ 
			        			if (desafiosBD[j].id_song == songsBD[m].id_song){ //busco la song del desafio en la lista de "songsBD"
			        				muroShow[i].extra2en=" en ";
			        				muroShow[i].extra2 =songsBD[m].title;
			        				muroShow[i].extra2_id =songsBD[m].id_song;
			        				m=songsBD.length+1;
			        			}
			        		}
			        		desafiosBD.splice(j,1);
			        		j=desafiosBD.length+1;
			        	}
			        }
			        break;
			    case "torneo":
			        for (var j=0; j<torneosBD.length; j++){
			        	if (actividadBD[i].id_torneo==torneosBD[j].id_torneo){
			        		muroShow[i].extra_id=torneosBD[j].id_torneo;
			        		muroShow[i].extra=torneosBD[j].nombre;
			        		j=torneosBD.length+1;
			        	}
			        }
			        break;
			    case "user":
			        for (var j=0; j<friendsBD.length; j++){ 
			        	if (actividadBD[i].id_user2 == friendsBD[j].id_user){
			        			muroShow[i].extra = friendsBD[j].username;
			        			muroShow[i].extra_id = friendsBD[j].id_user1;
			        			j=friendsBD.length+1;
			        	}
			        }
			        break;
			    default:
			        console.log("tipo desconocido");
			}//fin Swith
    	}//fin del for principal

    	for (var i=0;i<desafiosBD.length;i++){
    		muroShow.unshift(Actividad());
    		muroShow[0].descripcion = "te ha retado a";
    		muroShow[0].tipo = "desafio";
    		muroShow[0].fecha = new Date(desafiosBD[i].fech_create);
    		muroShow[0].id_user = desafiosBD[i].id_user1;

    		for (var j=0; j<friendsBD.length; j++){
    			if (muroShow[0].id_user == friendsBD[j].id_user){
    				muroShow[0].url_foto= path + friendsBD[j].url_foto;	//url_foto del usuario activo
    				muroShow[0].nombreUser=friendsBD[j].username;	//Nombre del usuario activo
    				j=friendsBD.length+1;
    			}
    		}
    		for (var j=0;j<songsBD.length; j++){
	        	if (desafiosBD[i].id_song==songsBD[j].id_song){
	        		muroShow[i].extra=songsBD[j].title;
	        		muroShow[i].extra_id=songsBD[j].id_song;
	        		j=songsBD.length+1;
	        	}
			}

    	}
    	muroShow.sort(function(a,b){return b.fecha-a.fecha});
    	return(muroShow);
    }//fin de la funcion makeMuroShow

   
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// FUNCIONES PARA SECCION ACTIVIDAD ////////////////////////
///////////////////////////////////////////////////////////////////////////////////// 
    this.makeActividadesShow = function(actividadFriendsBD,friendsBD,grabacionesFriendsBD,torneosBD,friendsfriendsBD,desafiosFriendsBD,userBD,songsBD){
    	actividadShow = new Array();
    	for (var i=0; i<actividadFriendsBD.length; i++){
    		if(actividadFriendsBD[i].date >= userBD[0].create_time){
	    		//CREO UN OBJECTO ACTIVIDAD Y LO COLO EN EL ARRAY
	    		actividadShow.push(Actividad());
	    		//añado la info del post
                actividadShow[i].id_post = actividadFriendsBD[i].id_post;
	    		actividadShow[i].descripcion=actividadFriendsBD[i].comment; //descripcion commentario
	    		actividadShow[i].tipo=actividadFriendsBD[i].tipo;			//tipo de post
	    		actividadShow[i].fecha=new Date(actividadFriendsBD[i].date);		//fecha del post
	    		actividadShow[i].id_user=actividadFriendsBD[i].id_user;		//id_user del usuario activo
	    		//añado la info del user activo
	    		for (var j=0; j<friendsBD.length; j++){
	    			if (actividadShow[i].id_user == friendsBD[j].id_user){
	    				actividadShow[i].url_foto= path + friendsBD[j].url_foto;	//url_foto del usuario activo
	    				actividadShow[i].nombreUser=friendsBD[j].username;	//Nombre del usuario activo
	    				j=friendsBD.length+1;
	    			}
	    		}
	    		//checkeo el tipo y fusiono el campo
	    		switch(actividadShow[i].tipo) {
				    case "grabacion":
				        for (var j=0;j<grabacionesFriendsBD.length; j++){
				        	if (actividadFriendsBD[i].id_grabacion==grabacionesFriendsBD[j].id_grabacion){
				        		actividadShow[i].extra_id=grabacionesFriendsBD[j].id_grabacion;
				        		for (var m=0;m<songsBD.length; m++){
				        			if (grabacionesFriendsBD[j].id_song==songsBD[m].id_song){
				        				actividadShow[i].extra=songsBD[m].title;
				        				m=songsBD.length+1;
				        			}
				        		}
				        		j=grabacionesFriendsBD.length+1;
				        	}
				        }
				        break;
				    case "song":
				        for (var j=0;j<songsBD.length; j++){
				        	if (actividadFriendsBD[i].id_song==songsBD[j].id_song){
				        		actividadShow[i].extra=songsBD[j].title;
				        		actividadShow[i].extra_id=songsBD[j].id_song;
				        		j=songsBD.length+1;
				        	}
				        }
				        break;
				    case "desafio":
				        for (var j=0; j<desafiosFriendsBD.length; j++){
				        	if (actividadFriendsBD[i].id_desafio == desafiosFriendsBD[j].id_desafio){ //busco el objeto desafio con el id_desafio
				        		for (var m=0; m<friendsfriendsBD.length; m++){ 
				        			if (desafiosFriendsBD[j].id_user2 == friendsfriendsBD[m].id_user){ //busco el user2 del desafio en la lista de "friendsfriendsBD"
				        				actividadShow[i].extra = friendsfriendsBD[m].username;
				        				actividadShow[i].extra_id = friendsfriendsBD[m].id_user;
				        				m=friendsfriendsBD.length+1;
				        			}
				        		}
				        		for (var m=0; m<songsBD.length; m++){ 
				        			if (desafiosFriendsBD[j].id_song == songsBD[m].id_song){ //busco la song del desafio en la lista de "songsBD"
				        				actividadShow[i].extra2en=" en ";
				        				actividadShow[i].extra2 =songsBD[m].title;
				        				actividadShow[i].extra2_id =songsBD[m].id_song;
				        				m=songsBD.length+1;
				        			}
				        		}
				        		j=desafiosFriendsBD.length+1;
				        	}
				        }
				        break;
				    case "torneo":
				        for (var j=0; j<torneosBD.length; j++){
				        	if (actividadFriendsBD[i].id_torneo==torneosBD[j].id_torneo){
				        		actividadShow[i].extra_id=torneosBD[j].id_torneo;
				        		actividadShow[i].extra=torneosBD[j].nombre;
				        		j=torneosBD.length+1;
				        	}
				        }
				        break;
				    case "user":
				        for (var j=0; j<friendsfriendsBD.length; j++){ 
				        	if (actividadFriendsBD[i].id_user2 == friendsfriendsBD[j].id_user){ //busco el user2 del desafio en la lista de "friendsfriendsBD"
				        			actividadShow[i].extra = friendsfriendsBD[j].username;
				        			actividadShow[i].extra_id = friendsfriendsBD[j].id_user1;
				        			j=friendsfriendsBD.length+1;
				        	}
				        }
				        break;
				    default:
				        console.log("tipo desconocido");
				}//fin Swith
			}
    	}
    	return(actividadShow);
    }

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////   FUNCIONES PARA SECCION MUROS   ////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
    this.makeSeguidores=function(followers,seguidos){
            for (var i=0; i<followers.length; i++){
                followers[i].extra = false;
                for (var j=0; j<seguidos.length;j++){
                    if (followers[i].id_user == seguidos[j].id_user){
                        followers[i].extra = true;
                        j=seguidos.length+1;
                    }
                }
                if (followers[i].extra){
                    followers[i].extraDesc="Dejar de seguir";
                    followers[i].icon_follow="glyphicon glyphicon-eye-close";
                }
                else{
                    followers[i].extraDesc="Seguir";
                    followers[i].icon_follow="glyphicon glyphicon-eye-open";
                }
            }
            return followers;
    }

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////   FUNCIONES PARA SECCION USER   /////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

    this.makeUsers=function(users,seguidos){
        var aux=0;
        for (var i=0; i<users.length; i++)//BUSCAR AL MISMO USER Y A LOS BOOTS
            if (users[i].id_user==0 || users[i].id_user==parseInt(sessionService.get('id'))){
                users.splice(i,1);
                if (aux==0){
                    i=-1;
                    aux++;
                }
                else
                    i=users.length+1;
            }

        for (var i=0; i<users.length; i++){
            users[i].extra = false;
            users[i].edad = this.getAge(users[i].fech_nac);
            for (var j=0; j<seguidos.length;j++){ //
                if (users[i].id_user == seguidos[j].id_user){
                    users[i].extra = true;
                    j=seguidos.length+1;
                }
            }
            if (users[i].extra){
                users[i].extraDesc="Dejar de seguir";
                users[i].icon_follow="glyphicon glyphicon-eye-close";
            }
            else{
                users[i].extraDesc="Seguir";
                users[i].icon_follow="glyphicon glyphicon-eye-open";
            }
        }
        console.log(users);
        return users;
    }





    this.getAge = function (dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// FUNCIONES PARA SECCION MENSAJES  ////////////////////////
///////////////////////////////////////////////////////////////////////////////////// 

    this.getLastMensajesSenderBD = function () {
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return $http.post(path+'getLastMensajesSender.php',id);
    }

    this.getLastMensajesRecepterBD = function () {
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return $http.post(path+'getLastMensajesRecepter.php',id);
    }

    this.getMensajesbyIdBD = function() {
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id2":userGlobal.id_user};
        return $http.post(path+'getMensajes.php',id);
    }
    this.getMensajesbyIdBD2 = function(id2) {
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id2":id2};
        return $http.post(path+'getMensajes.php',id);
    }

    this.sendMensajeBD = function (texto) {
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id2":userGlobal.id_user,"texto":texto};
        return $http.post(path+'sendMensaje.php',id);
    }
    this.sendMensajeBD2 = function (texto, id2) {
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id2":id2,"texto":texto};
        return $http.post(path+'sendMensaje.php',id);
    }

    this.smsUser = function(){
        $window.location.reload();
    }



    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////

    this.goToMuroUser=function(id_user){
        sessionService.set("id_selected",id_user);
        if ($location.path()=='/menu/comunidad/muroComunidad')
            $window.location.reload();
        else
            $location.path('/menu/comunidad/muroComunidad');
    }


    //

    this.modalUser = function(user){
        userGlobal=user;
        var modalInstance = $modal.open({
            templateUrl: 'partials/comunidad/userModal.html',
            controller: 'userModalCtrl',
            backdrop: false,
            size: 'lg' ,
            windowClass: 'xx-dialog'
        });
    }



    //********* COMENTARIOS *********
    this.getComentariosBD = function(id_post){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_post":id_post};
        return $http.post(path+'getComentarios.php',id);
    }

    this.setComentarioBD = function(id_post,contenido){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_post":id_post,"contenido":contenido};
        return $http.post(path+'setComentario.php',id);
    }

    this.getPostIdbyComentarioBD = function(id_grabacion){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_grabacion":id_grabacion};
        return $http.post(path+'getPostIdByGrabacionId.php',id);
    }


});