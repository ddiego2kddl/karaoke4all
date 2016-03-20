app.service('grabacionesService', function($http,$q,sessionService){
	//********* TODAS LAS GRABACIONES *********
    this.getGrabacionesBD = function(){
    	var id = {"id":sessionService.get("id"),"token":sessionService.get("token")};
    	return $http.post(path+'getGrabacionesAll.php',id);
    }

    //*** CONSTRUCTOR DE CLASE ACTIVIDAD PARA MOSTRAR *****
    this.Grabacion = function(grabBD){
        var grab={};

        grab.id_grabacion = grabBD.id_grabacion;
        grab.id_user = grabBD.id_user; //
        grab.id_song = grabBD.id_song;//
        grab.fecha = grabBD.fecha;
        grab.tipo = grabBD.tipo;
        if (grab.tipo=="audio")
            grab.glyph = true;
        grab.url = grabBD.url_file;
        grab.desc = grabBD.comment;

        grab.user_name=""; //
        grab.user_foto=""; //

        grab.song_title="";//
        grab.song_language="";
        grab.song_artist="";
        grab.song_estilo="";

        return grab;
    }

    var search = {};
    this.setFilter = function(opciones){
        search=opciones;
    }
    this.getFilter = function(){
        var aux = search;
        search = {};
        return aux;
    }

    this.makeGrabaciones = function(grabaciones,songs,users){
        var grabacionesShow = new Array();
        for (var i=0; i<grabaciones.length; i++){
            var temp = this.Grabacion(grabaciones[i]);

            for (var j=0; j<songs.length; j++){
                if (temp.id_song == songs[j].id_song){
                    temp.song_title = songs[j].title;
                    temp.song_language = songs[j].language;
                    temp.song_artist = songs[j].artist;
                    temp.song_estilo = songs[j].style;
                    j=songs.length +1;
                }
            }

            for (var j=0; j<users.length; j++){
                if (temp.id_user == users[j].id_user){
                    temp.user_name = users[j].username;
                    temp.user_foto = users[j].url_foto;
                }
            }


            grabacionesShow.push(temp);
        }
        return grabacionesShow;
    }
 


});