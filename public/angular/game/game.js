(function() {
    angular
        .module('mimg')
        .controller('gameController', gameController);
    gameController.$inject = ['authentication', '$location', '$http'];
    function gameController(authentication, $location, $http) {
        var vm = this;
        vm.data = [];
        vm.pushData = {};
        vm.isLoggedIn = authentication.isLoggedIn();
        vm.returnPage = $location.search().page || '/score';
        if (authentication.isLoggedIn()){
            $http.get('/game/images', {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }           
            }).success(function(data) {
                vm.data = data.data;
            });
        }
        vm.submit = function() {
            $http.post('/game/images', vm.pushData, {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                } 
            }).error(function(err) {
                vm.formError = err;
            })
            .then(function(){
                $location.search('page', null);
                $location.path(vm.returnPage);         
            });
        }

        vm.logout = function() {
            authentication.logout();
            $location.path('/');
        }
    }

})();