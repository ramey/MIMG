(function(){
    angular
        .module('mimg')
        .controller('scoreController', scoreController);
    scoreController.$inject = ['authentication', '$location', '$http'];
    function scoreController(authentication, $location, $http) {
        var vm = this;
        vm.score = 0;
        vm.data = [];
        vm.isLoggedIn = authentication.isLoggedIn();
        if (authentication.isLoggedIn()){
            const userdata = authentication.currentUser();
            const username = userdata.username;
            const url = '/api/scores/' + username;
            $http.get(url).success(function(data) {
                vm.score = data.score;
                vm.apply();
            });
        }
        vm.logout = function() {
            authentication.logout();
            $location.path('/');
        }
        vm.playagain = function() {
            $location.path('/game');
        }
    }
})();