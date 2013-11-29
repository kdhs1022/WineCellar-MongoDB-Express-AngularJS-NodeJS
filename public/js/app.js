'use strict';

// Declare app level module which depends on filters, and services
angular.module('wineApp', ['wineApp.filters', 'wineApp.services', 'wineApp.directives', 'ngUpload']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '../partials/HomeView'
      }).
      when('/wines', {
        templateUrl: '../partials/WineListItemView',
        controller: WinesListItemCtrl
      }).
      when('/wines/:id', {
        templateUrl: '../partials/EditWineView',
        controller: EditWineCtrl
      }).
      when('/addWine', {
        templateUrl: '../partials/AddWineView',
        controller: AddWineCtrl
      }).
      when('/about', {
        templateUrl: '../partials/AboutView',
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);