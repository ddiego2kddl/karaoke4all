app.service('cancionesService', function($http,$q,sessionService,$modal){
	//********* TODAS LAS CANCIONES *********
    this.getSongsBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
        return $http.post(path+'getSongs.php',id);
    }

    this.getIdiomasBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
    	return $http.post(path+'getIdiomas.php',id);
    }

    this.getEstilosBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
    	return $http.post(path+'getEstilos.php',id);
    }

    this.modalSong = function(controller,path,song){
        songGlobal=song;
        var modalInstance = $modal.open({
            templateUrl: path,
            controller: controller,
            backdrop: false,
            size: 'sm' ,
            windowClass: 'xx-dialog'
        });
    }


    this.getPuntosSongBD = function(id_song){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_song":id_song};
        return $http.post(path+'getPuntosSong.php',id);
    }

    this.countGrabacionesSongBD = function(id_song){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_song":id_song};
        return $http.post(path+'countGrabacionesSong.php',id);
    }

    this.countPostsSongBD = function(id_song){
        var id = {"id":sessionService.get("id"),"token":sessionService.get("token"),"id_song":id_song};
        return $http.post(path+'countPostsSong.php',id);
    }
});