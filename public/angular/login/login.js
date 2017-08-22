(function() {
    angular
        .module('mimg')
        .controller('loginController', loginController);
    loginController.$inject = ['authentication', '$location'];
    function loginController(authentication, $location) {
        var vm = this;
       
        vm.credentials = {
            username: '',
            password: ''
        };
        vm.onSubmit = function() {
            vm.formError = "";
            if (!vm.credentials.username || !vm.credentials.password) {
                vm.formError = "All fields required";
                return false;
            } else {
                vm.doLogin();
            }
        };

        vm.doLogin = function() {
            vm.formError = "";
            authentication
                .login(vm.credentials)
                .error(function(err){
                    vm.formError = err;
                })
                .then(function(){
                    vm.reroute();
                })
        }

        vm.reroute = function() {
            $location.path('/game');
        }
    }

})();