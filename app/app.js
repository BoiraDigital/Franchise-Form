var app = angular.module('franchiseform' , ['ksSwiper' ,'pascalprecht.translate' ,'ui.router' , 'uiGmapgoogle-maps']);

app.config(['$translateProvider', function ($translateProvider) {
    
    $translateProvider.useStaticFilesLoader({
        prefix : 'i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('fr');
    $translateProvider.usePostCompiling(true);

}])
.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])
.config(
    ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            china: true,
            sensor: false,
            v: '3.20',
            libraries: 'weather,geometry,visualization,drawing',
            key: 'AIzaSyAZymgHz8v3KEX84q2NtoR_d2AqSNu9NPM'
        });
    }]
)
.factory("$translateStaticFilesLoader", ["$q", "$http",
  function(a, b) {
    return function(c) {
        if (!c || !angular.isString(c.prefix) || !angular.isString(c.suffix)) throw new Error("Couldn't load static files, no prefix or suffix specified!");
        var d = a.defer();
        return b({
            url: [c.prefix, c.key, c.suffix].join(""),
            method: "GET",
            params: ""
        }).success(function(a) {
            d.resolve(a);
        }).error(function() {
            d.reject(c.key);
        }), d.promise;
    }
    $translateProvider.preferredLanguage('');
}])
.config(
    function($stateProvider, $urlRouterProvider , $locationProvider ) {

        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
        .state('form', {
            url: '/:lang',
            title : 'Dashboard',
            views : {
            	'body' :{
	                templateUrl: 'templates/form.html',
	                controller: 'MainController'
            	}
            }
        })
    }
)
.directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div id="fountainG"><div><img src="assets/loader.gif"/></dicv></div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  })