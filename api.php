<?php 
ob_start();

header('Content-Type:application/json;charset=utf-8');


if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST))
    $_POST = json_decode(file_get_contents('php://input'), true);

if($_POST){

	include_once('ConnectionClass.php');

	$result = false;

	$lang = substr($_POST["Candidature"]["Language"] , 0,2);

	if(!in_array($lang , array("ca","es","fr","en")))
		$lang = "es";

	$translations = array(
		"OK" => array(
			"ca" => "Dates desades correctament. \nProperament un comercial es posarà en contacte amb vosté.",
			"fr" => "Francès",
			"es" => "Castellano",
			"en" => "English"
			),
		"KO" => array(
			"ca" => "Hi ha hagut algun error durat el procés. \nSi us plau provi-ho de nou més tard.",
			"fr" => "Francès - KO ",
			"es" => "Castellano - KO ",
			"en" => "English - KO "
			)
		);



	$req = new ConnectionClass();

	$result = $req->Insert($_POST);

	if(!$result){
		//flush(); // Flush the buffer
        ob_clean();
		print_r(json_encode(array("msg" => $translations["KO"][$lang])));
		header('Content-Type:application/json;charset=utf-8');
		header("HTTP/1.1 403 Unauthorized" );
		die;
	}
	print_r(json_encode(array("msg" => $translations["OK"][$lang])));

}else{
	print_r(json_encode(array(
		"Access" => "Forbidden ","Message" => "Method not allowed "
		)));
}

ob_flush();

?>