// FOR ANDROID, CREATE AN ACTION BAR
function createActionBar() {
    console.log('Creating the ActionBar');
    var actionBar = $.mainWWindow.activity.actionBar;
    console.log('ActionBar exists and will define properties...!');
    actionBar.title = "Dream Destination a Day";
    
    //actionBar.setDisplayHomeAsUp(true);
    //actionBar.onHomeIconItemSelected = function() {
        //Ti.Android.currentActivity.finish();
    //    $.serviceDetailWindow.close();
    //};
    
    $.mainWWindow.activity.onCreateOptionsMenu = function(e) {
        var menu = e.menu;
        var reload = menu.add({
            title: "Reload",
            showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
        	});
        reload.addEventListener('click', function(e) {
           getRemoteData();
        });
        var share = menu.add({
        	title: "Share",
            showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
        	});
        share.addEventListener('click', function(e) {
           sharePOI();
        });
    };
}

// detects when the application starts
$.mainWWindow.addEventListener('open', function(e) {
	if(OS_ANDROID) {
        createActionBar();
    } 
	// get data from the network	
	getRemoteData();
});

function getRemoteData() {
	var url = defaultURL + "ddday";
	
	var client = Ti.Network.createHTTPClient({
		onload: function(e) {
			Ti.API.info("Received = " + this.responseText);
			var poi = JSON.parse(this.responseText);
			
			$.destinatonImage.image = poi.POIimageURL;
			$.destinationName.text = poi.POIname;
			$.destinationPlace.title = poi.POIdetails;
			
			Ti.App.Properties.setObject("poi", poi);
		},
		onerror: function(e) {
			alert("Error on communication " + e.toString);
		},
		timeout: 5000
	});
	client.open("GET", url);
	client.send();
}

function openMap(e) {
	var mapWindow = Alloy.createController("destinationMap").getView();
    mapWindow.open({
        modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
    });
}

function sharePOI(e) {
	var shareDestWindow = Alloy.createController("shareDestination").getView();
        shareDestWindow.open({
             modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
        });
}

$.mainWWindow.open();