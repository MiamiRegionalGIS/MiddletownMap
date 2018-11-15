<?php
ini_set('display_errors', 1); 

//database login info
$host = 'localhost';
$port = '5432';
$dbname = 'web_map';
$user = 'postgres';
$password = 'MUMGIS';

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
if (!$conn) {
	echo "Not connected : " . pg_error();
	exit;
}

//get the table and fields data
$table = $_GET['table'];
$fields = $_GET['fields'];

//turn fields array into formatted string
$fieldstr = "";
foreach ($fields as $i => $field){
	$fieldstr = $fieldstr . "l.$field, ";
}

//get the geometry as geojson in WGS84
//$fieldstr = $fieldstr . "ST_AsGeoJSON(ST_Transform(l.geom,4326))";
$fieldstr = $fieldstr . "ST_AsGeoJSON(l.geom)";
//create basic sql statement
/*$sql = "SELECT $fieldstr FROM $table l";*/
$sql = "SELECT row_to_json(fc)
 FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
 FROM (SELECT 'Feature' As type
    , ST_AsGeoJSON(lg.geom)::json As geometry
    , row_to_json(lp) As properties
   FROM $table As lg 
         INNER JOIN (SELECT gid, id FROM $table) As lp 
       ON lg.gid = lp.gid  ) As f )  As fc";

//if a query, add those to the sql statement
if (isset($_GET['featname'])){
	$featname = $_GET['featname'];
	$distance = $_GET['distance'] * 1000; //change km to meters
	//join for spatial query - table geom is in EPSG:26916
	$sql = $sql . " LEFT JOIN $table r ON ST_DWithin(l.geom, r.geom, $distance) WHERE r.featname = '$featname';";
}
//echo $sql;
//send the query
if (!$response = pg_query($conn, $sql)) {
	echo "A query error occured.\n";
	exit;
};

/*	echo $response;*/

//echo the data back to the DOM

while ($row = pg_fetch_row($response)) {
	foreach ($row as $i => $attr){
		echo $attr;
	}
	//echo ";";
}
?>


