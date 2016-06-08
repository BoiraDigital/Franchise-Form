app.directive('getPlaces' , function(){
	var APIKEY = "AIzaSyAZymgHz8v3KEX84q2NtoR_d2AqSNu9NPM";
	return {
		require : '^ngModel',
        restrict: 'AE',
        link: function(scope, element, attrs, model ) {
        	var el_id = element.attr('id')
        	if(!el_id){
        		el_id = 'autocomplete-' + $('.autocomplete').length;
        		element.addClass('autocomplete')
        		element.attr('id' , el_id )
        	}
        	element.on({
		        focus: function() {
		            this.geolocate();
		        }
		    });
		    var placeSearch, autocomplete;
		    var componentForm = {
		        street_number: 'short_name',
		        route: 'long_name',
		        locality: 'long_name',
		        administrative_area_level_2: 'long_name',
		        country: 'short_name',
		        postal_code: 'short_name'
		    };
		    this.initialize = function() {

		    	if(isNaN(model.$viewValue) )
		    		model.$setViewValue("");

		        autocomplete = new google.maps.places.Autocomplete(
		                /** @type {HTMLInputElement} */
		                (document.getElementById(el_id)),
		                {types: ['geocode']});
		        google.maps.event.addListener(autocomplete, 'place_changed', function() {
		            fillInAddress();
		        });
		    }
		    this.search = function(string){
		    	var list = Enumerable.from(this.place.address_components).where(function(x){
		    		var f = Enumerable.from(x.types).where("$ == '" + string  + "'").toArray();
		    		if(f.length)
		    			return true
		    		return false
		    	}).toArray();

		    	if(list.length)
		    		return list[0].long_name 
		    	else
		    		return null;
		    }
		    this.fillInAddress = function() {
		        // Get the place details from the autocomplete object.
		        var place = autocomplete.getPlace();
		       	this.place = place;

		    	console.log(this.place.address_components)
		       	var _model = {
		       		Address : this.search('route'),
		       		Number : this.search('street_number'),
		       		City : this.search('locality'),
		       		Country : this.search('country'),
		       		PostalCode : this.search('postal_code'),
		       		AdminLv1 : this.search('administrative_area_level_1'),
		       		AdminLv2 : this.search('administrative_area_level_2'),
		       		AdminLv3 : this.search('administrative_area_level_3'),
		       		Map : place.url,
		       		Static : "https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&center="+place.geometry.location.lat()+","+place.geometry.location.lng()+"&zoom=16&size=640x400&key=" + APIKEY
		       	}
		       	model.$setViewValue(_model);
		    }
		    this.geolocate = function() {
		        if (navigator.geolocation) {
		            navigator.geolocation.getCurrentPosition(function(position) {
		                var geolocation = new google.maps.LatLng(
		                        position.coords.latitude, position.coords.longitude);
		                autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
		                        geolocation));
		            });
		        }
		    }
        	this.initialize();
        }
    }
});
app.directive('fileUpload' , [ '$http',function($http){
	return {
		require : '^ngModel',
	    restrict: 'AE',
	    link: function(scope, element, attrs, model ) {
	    	scope.text = attrs.text;
	    	scope.delete = function(ind){
	    		var _mod = model.$viewValue
				try{
					_mod.splice(ind , 1);
					model.$setViewValue(_mod);
				}catch(f){}
	    	}
	    	element.on('change' , function(){
	    		file = element.find('input')[0].files;
	    		var name = file[0].name;
				var url = "http://api.nostrum.eu/api/upload/post"
		        var connection = {
		            url: url,
		            data: null,
		            method: 'POST',
		            transformRequest: angular.identity,
		            headers: {
		                'Content-Type': undefined,
		                "Accept": "application/json;text/html",
		            }
		        }
		        var fd = new FormData();
		        fd.append('file', file[0])

		        connection.data = fd;
		        $http(connection).success(function (f , d , s) {
		        	var _mod = model.$viewValue;
		            try {
		                _mod.push({ url : f.url[0] , name : name });
		                model.$setViewValue(_mod);
		            }catch(e){
		                alert('Error')
		            }
		        })
	    	})
	    },
	    template : '<input type="file" class="file-upload" translate="{{text}}"><ul class="list-unstyle"><li ng-repeat="x in md">{{x.name}}<i class="glyphicon glyphicon-remove" ng-click="delete($index)"></i></li></ul>',
	    scope : { md : '=ngModel' }
	}
}]);