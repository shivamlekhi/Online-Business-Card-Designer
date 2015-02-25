$(document).ready(function() {
	fbInit();
	// init();

	UI();
});

function fbInit () {
	window.fbAsyncInit = function() {
		FB.init({
      		appId      : '1414378392147725', // App ID
      		status     : true, // check login status
      		cookie     : true, // enable cookies to allow the server to access the session
      		xfbml      : true  // parse XFBML
      	});

		$("#OpenLogin").click(function() {
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					alert("Logged In");
				} else if (response.status === 'not_authorized') {
					login();
				} else {
					login();
				}
			});
		});

	};
}

function UI() {
	$("#Logout").click(function() {
		if(FB) {
			FB.logout(function(res) {
				alert("Logged Out");
			});
		}
	});

	$("#Check").click(function() {
		if(FB) {
			check();
		}
	});

	$("#GetFromFB_Button").click(function() {
		login();
	});
}

function FillUpForm() {
	FB.api('/me', {fields: "id,name,work,username,email,website"}, function(response) {
		if(response) {
			var edu = response.education;
			var work = response.work;

			// Setting UI Components
			$("#name_input").html(response.name);

/*			$('.edu').html(edu[2].school.name);
			$("#username").html(response.username);
			for (var i = edu.length - 1; i >= 0; i--) {				
				$("#EDU_SELECT").append("<option>" + edu[i].school.name + "</option>");
			};

			for (var i = work.length - 1; i >= 0; i--) {
				$("#WORK_SELECT").append("<option>" + work[i].employer.name + "</option>");
			};
			*/
			$("#name_input").attr("value", response.name);
			$("#Website_Input").attr("value", "www.facebook.com/" + response.username);

		}
	});

	FB.api("/me/picture",
	{
		"redirect": false,
		"height": "200",
		"type": "normal",
		"width": "200"
	}, function (response) {
		if (response && !response.error) {
			$("#Profile").attr("src", response.data.url);
		}
	}
	);
}

function login() {
	if(FB) {
		FB.login(function(response) {
			if (response.authResponse) {
				RotateCenterMain();
				FillUpForm();	
			}
		});	
	} else {    	
		RotateCenterMain();
		FillUpForm();
	}
}


// UI Funtions
function RotateCenterMain() {
	$(".CenterMain").css("-webkit-transform", "rotateY(180deg)");
	$(".CenterMain").css("z-index", "0");

	$(".CenterBack").css("-webkit-transform", "rotateY(0deg)");
}

  // Load the SDK Asynchronously
  (function(d){
  	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  	if (d.getElementById(id)) {return;}
  	js = d.createElement('script'); js.id = id; js.async = false;
  	js.src = "http://connect.facebook.net/en_US/all.js";
  	ref.parentNode.insertBefore(js, ref);
  }(document));