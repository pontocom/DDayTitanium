// FOR ANDROID, CREATE AN ACTION BAR
function createActionBar() {
    console.log('Creating the ActionBar');
    var actionBar = $.destMapNWindow.activity.actionBar;
    console.log('ActionBar exists and will define properties...!');
    actionBar.title = "Dream Destination a Day";
    
    actionBar.setDisplayHomeAsUp(true);
    actionBar.onHomeIconItemSelected = function() {
        $.destMapNWindow.close();
    };
    
    $.destMapNWindow.activity.onCreateOptionsMenu = function(e) {
        var menu = e.menu;
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
$.destMapNWindow.addEventListener('open', function(e) {
	if(OS_ANDROID) {
        createActionBar();
    } 
    
	// get data from ti.App.Properties
	var poi = Ti.App.Properties.getObject("poi");
	
	$.mapview.setLocation({
        latitude: poi.POIlat,
        longitude: poi.POIlng,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15
    });
    
    if(OS_IOS) {
	    var annotation = Alloy.Globals.Map.createAnnotation({
		    latitude: poi.POIlat,
		    longitude: poi.POIlng,
		    title: poi.POIname,
		    subtitle: poi.POIdetails,
		    pincolor: Alloy.Globals.Map.ANNOTATION_RED,
		    animate: true,
		    leftView: Ti.UI.createImageView({image : poi.POIimageURL, height : 50, width : 50}),
		    rightButton: Ti.UI.iPhone.SystemButton.INFO_DARK,	
		    placeId: poi.POIid // Custom property to uniquely identify this annotation.
		});
	    	
    } else {
	    var annotation = Alloy.Globals.Map.createAnnotation({
		    latitude: poi.POIlat,
		    longitude: poi.POIlng,
		    title: poi.POIname,
		    subtitle: poi.POIdetails,
		    pincolor: Alloy.Globals.Map.ANNOTATION_RED,
		    animate: true,
		    rightButton: Ti.UI.iPhone.SystemButton.INFO_DARK,	
		    placeId: poi.POIid // Custom property to uniquely identify this annotation.
		});
	    	
    }
	$.mapview.addAnnotation(annotation);

});

$.mapview.addEventListener('click', function(e) {
	console.log('Click Source -> ' + e.clicksource);
    if (e.clicksource == 'rightButton' || e.clicksource == 'title' || e.clicksource == 'subtitle' ) {
    	console.log('ID -> ' + e.annotation.placeId);
    	console.log('Name -> ' + e.annotation.title);
        var shareDestWindow = Alloy.createController("shareDestination").getView();
        shareDestWindow.open({
             modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
        });

    }
});

function sharePOI(e) {
	var shareDestWindow = Alloy.createController("shareDestination").getView();
    shareDestWindow.open({
         modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
    });
}

function closeDestMap(e) {
	$.destMapNWindow.close();
}
