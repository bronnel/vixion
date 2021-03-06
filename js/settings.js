


function showSettings(){
	console.log("showing settings");
	$("#screen").fadeOut(0);
	$("#screen").html(' ');	
	$("#screen").load("settings.html"); 
	$("#screen").fadeIn(1000);

}

function connectManually(){
	var ip = $('#server_ip').val();
	localStorage.setItem("ServerIP", '{ "ip" : "' + ip + '", "succes" : false}');
	startComWithDB(ip, connectSucces, doneReceiving,  connectError, getDirectory);
	sessionStorage.Connected == "pending";
	Materialize.toast('Trying to connected to ' + ip, 4000);	
	window.location.href= "#home";
}

function setDirectory(){
	var dir = $('#scanDir').val();
	setDir(dir);
	Materialize.toast('Trying to set directory: ' + dir, 4000);	
	window.location.href= "#home";
}

function getDirectory(dir){
	$('#scanDir').val(dir);
}

function refreshServerList(){
	detectWSocketServers();
	$('#servers').html(' '); 
	var intrv = setInterval(function(){
		var serverInfo = JSON.parse(sessionStorage.serversFound);
		$('#servers').html(' ');
		for(var x = 0; x < serverInfo.length; x++){

    		  $('#servers').append('<div class="col s12 row"><button href="#home" class="btn jewel waves-effect waves-light " style="width: 100%;" onclick="connectToServer(\'' + serverInfo[x].ip + '\')">' + serverInfo[x].ip + '</button></div>');
    	}

    	if(sessionStorage.CSSDFound == "true" && serverInfo.length > 0){			
	    	$('#loaderServers').hide();
		} else {
			$('#loaderServers').show();
		}
		
	}, 500);
}

function onSettingsLoad(){

	$('#loaderServers').hide();
	if(sessionStorage.Connected == "false" ){
		connectToServer();
	} else {
		var ipdata = JSON.parse(localStorage.getItem("ServerIP"));
		$('#connectedserver').append('<div class="col s12 row"><button href="#home" class="btn jewel waves-effect waves-light " style="width: 100%;">' + ipdata.ip + '</button></div>');
	}
	$('#scanDir').val(sessionStorage.dir);
}

function connectToServer(ip){
	if(ip === undefined){
		var ipdata = JSON.parse(localStorage.getItem("ServerIP"));
		if(sessionStorage.Connected == "false" && ipdata != null){
			startComWithDB(ipdata.ip, connectSucces, doneReceiving, connectError, getDirectory);
			sessionStorage.Connected == "pending";
			Materialize.toast('Trying to connect to ' + ipdata.ip, 4000);	

		
			window.location.href= "#home";
			showHome();

		} else {
			refreshServerList();
		}
	} else {

		localStorage.setItem("ServerIP", '{ "ip" : "' + ip + '", "succes" : false}');
		startComWithDB(ip, connectSucces, doneReceiving,  connectError, getDirectory);
		sessionStorage.Connected == "pending";
		Materialize.toast('Trying to connect to ' + ip, 4000);	

	
		window.location.href= "#home";
		showHome();
	}
	
}

function connectSucces(){
	if(sessionStorage.Connected == "false"){
		sessionStorage.Connected = true;
		var ipdata = JSON.parse(localStorage.getItem("ServerIP"));
		if(!ipdata.succes){
			ipdata.succes = true;
			localStorage.setItem("ServerIP", JSON.stringify(ipdata));
		}

		Materialize.toast('Succesfully received data from: ' + ipdata.ip, 4000);	
	}

}

function doneReceiving(){
}

function connectError(){
	var ipdata = JSON.parse(localStorage.getItem("ServerIP"));
	if(ipdata.succes){
		localStorage.removeItem("ServerIP");
		refreshServerList();
	}
}
