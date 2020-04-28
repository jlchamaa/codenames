let button_colors = {
	"blue": "primary",
	"red": "danger",
	"neutral": "secondary",
	"death": "warning"}

var socket = io();
// var server = Cookies.get("server");
// var username = Cookies.get("username");
var server = "tmgs";
var username = "jlc";
console.log(server);
console.log(server == undefined);
if (server == undefined || username == undefined){
    //$("#game_pane").hide();
}
else {
    //$("#login_pane").hide();
    socket.emit('join', {'server': server, 'username': username});
}


function startParty(event) {
    event.preventDefault();
    let server = "";
    let username = "";
    if (server == "" || username == ""){
        console.log("This ain't it chief");
    }
    else {
        socket.emit('join', {'server': server, 'username': username});
        Cookies.set('server', server, { expires: 1 })
        Cookies.set('username', username, { expires: 1 })
        //$("#login_pane").slideUp();
        //$("#game_pane").slideDown();
    }
    
}
// $(".box").click(function(event){
//     let box = event.target.id.split("-")[1];
//     console.log(box);
//     data.selected[box] = true;
//     socket.emit("select", {"selection": box, "server": server});
// });
// 
// $(".startover").click(function(event){
//      
// });

socket.on("refresh", function(updated_data){
    app.game_state = updated_data;
});
//$("#login_form").submit(function(event){startParty(event);});
