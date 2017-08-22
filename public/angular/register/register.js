(function(){
    angular
        .module('mimg')
        .controller('registerController', registerController);

    registerController.$inject = ['$location', 'authentication', '$http'];
    function registerController($location, authentication, $routeParams, $http) {
        var vm = this;
        vm.credentials = {
            username: '',
            password: '',
        };
        vm.returnPage = $location.search().page || '/';
        vm.onSubmit = function() {
            if(!vm.credentials.username || !vm.credentials.password) {
                vm.formError = "All fields are required";
                return false;
            } else {                
                vm.doRegister();
            }
        };

        vm.doRegister = function() {
            vm.formError = "";
            authentication
                .register(vm.credentials)
                .error(function(err){
                    vm.formError = err;
                })
                .then(function(){
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                });
        };
    };
})();
