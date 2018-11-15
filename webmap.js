/**Functions of the interactive MUM campus map
 @author jiangz5
 
//researved for future
function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map-canvas");
	console.log('browser detected');
  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.width = '100%';
    mapdiv.height = '100%';
  } else {
    mapdiv.width = '600px';
    mapdiv.height = '800px';
  }
  console.log('browser detected');
};
*/

//Display all features; function only responds to 'All' checkbox
function DisplayAllFeatures()
{
	var WhereClause='';
	var features= document.getElementsByName('legendlist');
	var SomeFeaturesChecked= false;

	if (features[0].checked){
		for (i=1; i< features.length; i++){features[i].checked=false;}
		layer.setOptions({
		  query:{
		    select: 'geometry',
		    from: '1s24ZMnYrmyZTDTy84t1gCUY_hGLpmZMxbmGS0pU' 
		   }, 
		   styleId:7,
  		});
    	layer.setMap(map);
	}
    else{
    	layer.setMap(null)
    }
}

//Display other features; function responds to any checkbox other than 'All'    
function DisplayFeatures()
{
	var WhereClause='';
	var features= document.getElementsByName('legendlist');
	var SomeFeaturesChecked= false;

	for (i=1; i< features.length; i++){
		if (features[i].checked){
			SomeFeaturesChecked= true;
			if (WhereClause){
				WhereClause = WhereClause + ",'" + features[i].value + "'"
			} 
			else{
				WhereClause = WhereClause + "'" + features[i].value+ "'"
			}
		}
	}	
	//compose complete whereclause based on selection
	if (SomeFeaturesChecked){
		features[0].checked=false;
		WC= "'Type' IN (" + WhereClause + ")";
		if (WhereClause!=''){
			layer.setOptions({
			  query:{
			    select: 'geometry',
			    from: '1s24ZMnYrmyZTDTy84t1gCUY_hGLpmZMxbmGS0pU',
			    where: WC, 
			   }, 
			   styleId:7,
    		});
	    	layer.setMap(map);
		}
	}
	
}
function DisplayFeatures2()
{
	var features= document.getElementById('legendlist2');
	if (features.selectedIndex==0){
		layer.setOptions({
		  query:{
		    select: 'geometry',
		    from: '1s24ZMnYrmyZTDTy84t1gCUY_hGLpmZMxbmGS0pU' 
		   }, 
		   styleId:7,
  		});
    	layer.setMap(map);
	}
	else{
		//compose complete whereclause based on selection
		WC= "'Type' = '" + features.options[features.selectedIndex].value + "'";
		layer.setOptions({
		  query:{
		    select: 'geometry',
		    from: '1s24ZMnYrmyZTDTy84t1gCUY_hGLpmZMxbmGS0pU',
		    where: WC, 
		   }, 
		   styleId:7,
		});
    	layer.setMap(map);
	}
}
//Switch base map between roadmap and satellite 
function btnRoadMap_OnClick()
{
	map.setMapTypeId(google.maps.MapTypeId.ROADMAP);	
}

function btnSateMap_OnClick()
{
	map.setMapTypeId(google.maps.MapTypeId.SATELLITE);	
}
function btnBaseMap_OnClick()
{
	var base= map.getMapTypeId(map);
	if (base=='satellite'){
		map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
		document.getElementById('btnBaseMap').textContent='Satellite';			
	}
	else if (base =='roadmap'){ 
		map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		document.getElementById('btnBaseMap').textContent='Map';
	}	
}
//Search features on map
function btnQuery_OnClick()
{
	var keyword=document.getElementById('txtKeyword').value.replace(/'/g, "\\\'"); 
    /*if (/[^A-Za-z]/.test(keyword)){
		alert("Please input a valid name")
		return false;
	}
	else{*/
		var whereclause = "'Title' CONTAINS IGNORING CASE '" + keyword + "'"
		layer.setOptions ({
			query: {
			    select: 'geometry',
				from: '1s24ZMnYrmyZTDTy84t1gCUY_hGLpmZMxbmGS0pU',
				where: whereclause
			}
		});
		layer.setMap(map);
	//}
}

//autocompletion of search input
function AutoComplete() {
    // Retrieve the unique feature names using GROUP BY workaround.
    var queryText = encodeURIComponent(
        "SELECT 'Title', COUNT() " +
        'FROM ' + '1s24ZMnYrmyZTDTy84t1gCUY_hGLpmZMxbmGS0pU' + " GROUP BY 'Title'");
    var query = new google.visualization.Query(
        'http://www.google.com/fusiontables/gvizdata?tq='  + queryText);

    query.send(function(response) {
      var numRows = response.getDataTable().getNumberOfRows();

      // Create the list of results for display of autocomplete.
      var results = [];
      for (var i = 0; i < numRows; i++) {
        results.push(response.getDataTable().getValue(i, 0));
      }

      // Use the results to create the autocomplete options.
      $('#txtKeyword').autocomplete({
        source: results,
        minLength: 1
      });
    });
}