$( document ).ready(function() { 
    let button_colors = {
		"blue": "primary",
		"red": "danger",
		"neutral": "secondary",
		"death": "warning"}

    function setCookie(cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays*24*60*60*1000));
          var expires = "expires="+ d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
    var socket = io();
    var server = getCookie("server");
    var username = getCookie("username");
    var data = {"selected": Array(25).fill(false), "colors": Array(25).fill("neutral")  }
    if (server == "" || username == "") {
        $("#game_pane").hide();
    }
    else {
        $("#login_pane").hide();
        socket.emit('join', {'server': server, 'username': username});
    }


    function startParty(event) {
        event.preventDefault();
        let server = $("#server_form")[0].value;
        let username = $("#username_form")[0].value;
        if (server == "" || username == ""){
            console.log("This ain't it chief");
        }
        else {
            socket.emit('join', {'server': server, 'username': username});
            setCookie("server", server, 1);
            setCookie("username", username, 1);
            $("#login_pane").slideUp();
            $("#game_pane").slideDown();
        }
        
    }
    function refreshTable(spymaster) {
        for (let num = 0; num < 25; num++){
            let selected = data.selected[num];
            let color = data.colors[num];
            if ( selected ){
                $("#box-" + num.toString()).removeClass("btn-outline-secondary");
                $("#box-" + num.toString()).addClass("btn-" + button_colors[color]);
            }
            else{
                if ( spymaster ){
                    $("#box-" + num.toString()).removeClass("btn-outline-secondary");
                    $("#box-" + num.toString()).addClass("btn-outline-" + button_colors[color]);
                }
            }
        }
	}
    $(".box").click(function(event){
        let box = event.target.id.split("-")[1];
        console.log(box);
        data.selected[box] = true;
        socket.emit("select", {"selection": box, "server": server});
    });

    socket.on("refresh", function(updated_data){
        data = updated_data;
        console.log(updated_data);
        refreshTable(true)
    });
    $("#login_form").submit(function(event){startParty(event);});
    $("#banner").html(server + " : " + username);
    refreshTable(true)


})
