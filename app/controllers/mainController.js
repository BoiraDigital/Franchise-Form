app.controller('MainController' , 
	['$scope' ,
	'FormService',
	'uiGmapGoogleMapApi',
	'uiGmapIsReady',
	'$http',
	'$state',
	'$translate',
	function($scope , FormService , uiGmapGoogleMapApi , uiGmapIsReady , $http , $state , $translate){

	/* BASIC PARAMS & ACTIONS */
		// $scope.investementrange = [
		// 	'< 50.000€','50.000 - 75.000€','75.000-100.000€' ,'100.000-150.000€','>150.000€'
		// ];
		$scope.progress = [
			{text : 'candidate info' , status : 1 ,id: 1},
			// {text : 'candidate address' , status : 0,id: 2},
			{text : 'candidate situation' , status : 0 ,id: 3},
			{text : 'project' , status : 0,id: 4},
			{text : 'project-2' , status : 0,id: 4},
			{text : 'founding info' , status : 0,id: 5},
			{text : 'observations & references' , status : 0,id: 6},
			{text : 'confirmation' , status : 0,id: 7},
		];
		if(localStorage.data){
			FormService = angular.fromJson(localStorage.data);

			if(FormService.Candidat.Name && FormService.Candidat.Email){
				$scope.progress[0].status = 2;
	
				if(FormService.Candidat.Address.Country && FormService.Candidat.Address.City ){
					$scope.progress[1].status = 2;
					//FormService.Candidat.AddressCopy = FormService.Candidat.Address;
				}else{
					$scope.progress[1].status = 1;
				}
			}

			
			$scope.progress[2].status = 2;

			if(FormService.Project.LocalPosition.language != 0 && FormService.Project.LocalPosition.longitude != 0){
				$scope.progress[3].status = 2;
				$scope.progress[4].status = 2;
				$scope.mapmoved = true;
			}
			if(FormService.Founding.Description && FormService.Founding.Description.length > 25){
				$scope.progress[5].status = 2;
				$scope.progress[6].status = 2;
			}
		}
		$scope.model =  FormService;

		if($state.params.lang == ""){
			var userLang = navigator.language || navigator.userLanguage; 
		}else{
			var userLang = $state.params.lang;
		}
		
		$translate.use(userLang.substring(0, 2));
		$scope.model.Candidature.Language = userLang;
		// $scope.model.Founding.PersonalApport = $scope.investementrange[1];
		$scope.delete = function(m , pos){
			try{
				m.splice(pos , 1);
			}catch(f){
			}
		}
		$scope.reference = {"name":"","address":"","mail":"","phone":""};

		$scope.copy = function(){
			if(!$scope.reference.name || !$scope.reference.mail){
				return;
			}
			var _ref = angular.copy($scope.reference);
			$scope.model.References.push(_ref);
			$scope.reference = {"name":"","address":"","mail":"","phone":""};

			$scope.form.referenceName.$setUntouched();
			$scope.form.referenceMail.$setUntouched();
		}
		
		$scope.s = [];

	/* ENDBASIC PARAMS & ACTIONS */

	/* MAP*/
		uiGmapGoogleMapApi.then(function(maps) {
			maps.visualRefresh = true;
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition($scope.setCenter);
			}
	    });

	    $scope.drawing = function(x){
	    	console.log(x)
	    }
		$scope.map = { 
			center: $scope.model.Project.LocalPosition,
			zoom: 8 ,
			draw: null,
			poligons : [],
			searchbox: { 
	          //template:'searchbox.tpl.html', 
	          events:{
	            places_changed: function (searchBox) {
	            	var place = searchBox.getPlaces()[0];
	            	console.log(place)
	            	$scope.map.center.latitude = place.geometry.location.lat();
	            	$scope.map.center.longitude = place.geometry.location.lng();
	            	$scope.map.zoom = 18
	            }
	          }
	        },
	        options: {
	          scrollwheel: false
	        }
		};
		uiGmapIsReady.promise(1).then(function(instances) {
	        instances.forEach(function(inst) {
	            var map = inst.map;
	            var uuid = map.uiGmap_id;
	            var mapInstanceNumber = inst.instance; // Starts at 1.
	        });
	        
	    });
		$scope.marker = {
		    id: "StorePosition",
		    coords: {
		        latitude: angular.copy($scope.map.latitude),
		        longitude: angular.copy($scope.map.longitude),
		    },
		    options: { draggable: true },
		    events: {
		        dragend: function (marker, eventName, args) {
		            var lat = marker.getPosition().lat();
		            var lon = marker.getPosition().lng();
		            $scope.map.latitude = lat,
		            $scope.map.longitude = lon;
		            $scope.mapmoved = true;
		        }
		    }
		};
		$scope.setCenter = function(c){
			var x = {
				latitude : c.coords.latitude,
				longitude : c.coords.longitude
			}
			$scope.model.Candidature.Position.latitude = x.latitude;
			$scope.model.Candidature.Position.longitude = x.longitude;

			$scope.model.Project.LocalPosition = x;
		}
		$scope.startDrawing = function() {
		  $scope.map.draw().then(function(path) {
		    $scope.map.polygons.push({ path: path, fill: "#ff0000" });
		  });
		};
		$scope.draw = {
		    drawingMode: google.maps.drawing.OverlayType.MARKER,
		    drawingControl: true,
		    drawingControlOptions: {
		      position: google.maps.ControlPosition.TOP_CENTER,
		      drawingModes: [
		        google.maps.drawing.OverlayType.MARKER,
		        google.maps.drawing.OverlayType.CIRCLE,
		        google.maps.drawing.OverlayType.POLYGON,
		        google.maps.drawing.OverlayType.POLYLINE,
		        google.maps.drawing.OverlayType.RECTANGLE
		      ]
		    },
		    //markerOptions: {icon: 'images/beachflag.png'},
		    circleOptions: {
		      fillColor: '#ffff00',
		      fillOpacity: 1,
		      strokeWeight: 5,
		      clickable: false,
		      editable: true,
		      zIndex: 1
		    }
	  	}

	/* ENDMAP */


    /* SWIPER */
	  	$scope.swiper = {}

	    //loop="false" show-nav-buttons="false" slides-per-view="1" space-between="5" pagination-clickable="false"  pagination=".pagination" pagination-type="progress" simulatetouch="false"
		$scope.next = function(){

			$scope.progress[$scope.swiper.activeIndex ].status = 2;
			$scope.progress[$scope.swiper.activeIndex + 1].status = 1;

	      	$scope.swiper.slideNext();

	      	localStorage.setItem('data' , angular.toJson($scope.model));
	    };	
	    $scope.to = function(index){
	    	$scope.swiper.slideTo(index);

	      	localStorage.setItem('data' , angular.toJson($scope.model));
	    }
	    $scope.prev = function(){
	      	$scope.swiper.slidePrev();

	      	localStorage.setItem('data' , angular.toJson($scope.model));
	    };

	    $scope.onReadySwiper = function (swiper) {
	    	$scope.swiper = angular.merge($scope.swiper , swiper);
	    };

    /* END SWIPER */


    /* VALIDATIONS */
	    $scope.validateCandidate = function()
	    {
			var fields = {
	    		name : $scope.form.candidateName,
	    		email : $scope.form.candidateEmail
	    	}
			if(fields.name.$valid && fields.email.$valid){
				return false
			}
	    	return true;
	    }

	    $scope.validateAddress = function(){
			var fields = {
	    		country : $scope.form.addressCountry,
	    		city : $scope.form.addressCity,
	    	}
			if(fields.city.$valid &&  fields.country.$valid){
				return false
			}
	    	return true;

	    }
	    $scope.validateSituation = function(){
			var fields = {
	    		situation : $scope.form.situation
	    	}
			if(fields.situation.$valid ){
				return false
			}
	    	return true;

	    }
	    $scope.validateProject = function(){

	    	return true
	    	if($scope.mapmoved)
	    		return false
	    	return true
	    }
	    $scope.validateFounding = function(){
			var fields = {
	    		foundingdescription : $scope.form.foundingDescription
	    	}
			if(fields.foundingdescription.$valid ){
				return false
			}
	    	return true;
	    }
		$scope.confirm = false;
	    $scope.validateAll = function(){

	    	if($scope.confirm)
	    		return true 

	    	return false
	    }

    /* END VALIDATIONS */


    /* SUBMITFORM */

    	$scope.submit = function(){
    		$scope.model.Candidature.DateEnd = moment().format();
    		$http({
    			url : 'api.php',
    			method : 'POST',
    			data : $scope.model

    		}).then(function(x , d){
    			localStorage.removeItem('data');
    			alert(x.data.msg);

    		},function(x){
    			console.log(FormService.Candidature.Language)
    			alert(x.data.msg)
    		})

    	}

    /* END SUBMITFORM */

    $scope.$watch('model.Candidat.Address' , function(x){
    	if(x.Country){
			$scope.model.Candidat.AddressCopy = x
			//console.log(x , $scope.model.Candidat.AddressCopy);
    	}
    })

    $scope.$watch('model.Project.Local' , function(x,i){


    	if(x == 'false'){
    		$scope.model.Project.LocalParams = {
				Surface : null,
				Floor: null,
				Terrace : 'true',
				CurrentActivity : null
			}
    	}
    })
}]);