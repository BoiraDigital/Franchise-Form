<?php
	
	include_once('ConnectionClass.php');

	$req = new ConnectionClass();

	$result = $req->Get(10 , 1);


	foreach($result as $key => $value){?>
	<p><?= $value['Timestamp'] ?></p>
	<pre><?  print_r(json_decode($value["Form"],true))?></pre>

<?php }?>
<!DOCTYPE html>
<!--
<html ng-app="franchiseform">
    <head>
         <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyAZymgHz8v3KEX84q2NtoR_d2AqSNu9NPM&libraries=places,drawing"></script>
        <title>{{ 'Homepage' | translate }}</title>
        <script src="bower_components/jquery/dist/jquery.min.js"></script>
        <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="bower_components/angular/angular.min.js"></script>
        <script src="bower_components/angular-translate/angular-translate.min.js"></script>
        <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
        <script src="bower_components/moment/min/moment-with-locales.min.js"></script>
        <script src="bower_components/linqjs/linq.min.js"></script>
        <script src="bower_components/lodash/dist/lodash.min.js"></script>
        <script src="bower_components/angular-simple-logger/dist/angular-simple-logger.min.js"></script>
        <script src="bower_components/angular-google-maps/dist/angular-google-maps.min.js"></script>
        <script src="app/app.js"></script>
        <script src="app/place.js"></script>
        <script src="app/formService.js"></script>
        <script src="app/controllers/mainController.js"></script>

        <script src="bower_components/Swiper/dist/js/swiper.js"></script>
        <script src="bower_components/angular-swiper/dist/angular-swiper.js"></script>

        <link href='http://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="bower_components/Swiper/dist/css/swiper.min.css">

        <link rel="stylesheet" href="style.css">
        <meta charset="UTF-8"/>
    </head>
    <body class="bg-{{swiper.activeIndex}} bg">
        <section ui-view="body">

        </section>
        <loading></loading>
    </body>
</html>
-->