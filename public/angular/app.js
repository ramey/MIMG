(function() {
    angular.module('mimg', ['ngRoute']);
    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'angular/login/login.html',
                controller: 'loginController',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: 'angular/register/register.html',
                controller: 'registerController',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: 'angular/login/login.html',
                controller: 'loginController',
                controllerAs: 'vm'
            })
            .when('/game', {
                templateUrl: 'angular/game/game.html',
                controller: 'gameController',
                controllerAs: 'vm'
            })
            .when('/score', {
                templateUrl: 'angular/score/score.html',
                controller: 'scoreController',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});
    };
    angular
        .module('mimg')
        .config(['$routeProvider', config])
})();