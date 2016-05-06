var facebook = Alloy.Globals.Facebook;
facebook.appid=1377942722521923;
facebook.permissions=['user_about_me', 'email', 'user_photos', 'publish_stream'];
facebook.forceDialogAuth = true;

var defaultText = "My dream destination for today is ";

// FOR ANDROID, CREATE AN ACTION BAR
function createActionBar() {
    console.log('Creating the ActionBar');
    var actionBar = $.shareDestNWindow.activity.actionBar;
    console.log('ActionBar exists and will define properties...!');
    actionBar.title = "Dream Destination a Day";
    
    actionBar.setDisplayHomeAsUp(true);
    actionBar.onHomeIconItemSelected = function() {
        $.shareDestNWindow.close();
    };
}

$.shareDestNWindow.addEventListener('open', function(e) {
	if(OS_ANDROID) {
        createActionBar();
    } 

	facebook.authorize();
	
	var poi = Ti.App.Properties.getObject("poi");

	
	$.destinationImage.image = poi.POIimageURL;
	$.destinationName.text = poi.POIname;
	
	$.destinationShareText.value = defaultText + poi.POIname + " (" + poi.POIdetails + ") #ddday";
	
	if(facebook.loggedIn) {
		getUserInfo();
	}
});

facebook.addEventListener('login', function(e) {
	if(e.success) {
		alert('Facebook authentication with success!!!');
		getUserInfo();
	}
});

function getUserInfo() {
	facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
	    if(e.success) {
	        var result = JSON.parse(e.result);
	        Ti.API.info('Result = ' + e.result);
	        Ti.App.Properties.setString('facebookUid', facebook.uid);
	        Ti.API.info('facebookUid = ' + facebook.uid);
	        Ti.App.Properties.setString('facebookUsername', result.username);
	        Ti.API.info('facebookUsername = ' + result.username);
	        Ti.App.Properties.setString('facebookName', result.first_name + ' ' + result.last_name);
	        Ti.API.info('facebookName = ' + result.first_name + ' ' + result.last_name);
	        Ti.App.Properties.setString('facebookEmail', result.email);
	        Ti.API.info('facebookEmail = ' + result.email);
	        Ti.App.Properties.setString('facebookToken', facebook.accessToken);
	        Ti.API.info('facebookToken = ' + facebook.accessToken);
    	} else {
    		alert('Some error has occured!!!');
    	}
	});
}

function shareDestinationFB(e) {
	var poi = Ti.App.Properties.getObject("poi");
	
	var data = {
		name: poi.POIname,
		message: $.destinationShareText.value,
		caption: $.destinationShareText.value,
		picture: poi.POIimageURL,
		description: $.destinationShareText.value
	};
	
	facebook.dialog("feed", data, function(e) {
                if(e.success && e.result) {
                    alert("Success! New Post ID: " + e.result);
                    shareDestinationAPIREST();
                    $.shareDestNWindow.close();
                } else {
                    if(e.error) {
                        alert(e.error);
                    } else {
                        alert("User canceled dialog.");
                    }
                }
            });
	
	// Ask for write permission
    /*
    facebook.reauthorize(['publish_stream'], 'me', function(e){
        if (e.success) {
            // If successful, proceed with a publish call
            facebook.dialog("feed", data, function(e) {
                if(e.success && e.result) {
                    alert("Success! New Post ID: " + e.result);
                    shareDestinationAPIREST();
                    $.shareDestNWindow.close();
                } else {
                    if(e.error) {
                        alert(e.error);
                    } else {
                        alert("User canceled dialog.");
                    }
                }
            });
        } else {
            if (e.error) {
                alert(e.error);
            } else {
                alert("Unknown result");
            }
        }
    });*/
}

function shareDestinationAPIREST() {
	var poi = Ti.App.Properties.getObject("poi");
	var url = defaultURL + "ddday";

	var now = new Date();
	var data = {
		UUID: Ti.App.Properties.getString('facebookUid'),
		email: Ti.App.Properties.getString('facebookEmail'),
		FB: true,
		TW: false,
		POIid: poi.POIid,
		date: now
	};
	
	var client = Ti.Network.createHTTPClient({
		onload: function(e) {
			
		},
		onerror: function (e) {
			alert(e.error);
		},
		timeout: 5000
	});
	client.open("POST", url);
	client.send(data);
}


function closeShareDest(e) {
	$.shareDestNWindow.close();
}
