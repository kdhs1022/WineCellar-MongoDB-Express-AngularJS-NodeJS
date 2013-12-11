'use strict';

/* Controllers */
function WinesListItemCtrl($scope, $http) {
  $http.get('/api/wines').
    success(function(data, status, headers, config) {
      $scope.wines = data.wines;
    });
}

function AddWineCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.years = ['2012', '2011', '2010', '2009', '2008', '2007', '2006'];

  // $scope.uploadComplete = function (content, completed) {
  // };
  $scope.home = function () {
    $location.url('/wines/');
  };
}

function EditWineCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $scope.years = ['2012', '2011', '2010', '2009', '2008', '2007', '2006'];
  $http.get('/api/wines/' + $routeParams.id).success(function(data) {
    $scope.form = data.wine;
  });
  $scope.deleteWine = function () {
    $http.delete('/api/wines/' + $routeParams.id).success(function(data) {
      $location.url('/wines/');
    });
  };
}
