angular.module('starter.controllers', ['ngAudio'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
})

.controller('EpisodesCtrl', function($scope, $http, $ionicLoading) {
    $ionicLoading.show({template: 'Loading'});
    $http.get('http://www.somethingsunshine.com/api/episodes').then(function(data){
        $ionicLoading.hide();
        $scope.episodes = data.data;
        console.log($scope.episodes);
    }, function(){
        $ionicLoading.show({template: 'Something went wrong...', duration: 2000});
    })

})

.controller('EpisodeCtrl', function($scope, $stateParams, $window, $http, $ionicLoading, ngAudio) {
    $ionicLoading.show({template: 'Loading'});
    $http.get('http://www.somethingsunshine.com/api/episode/' + $stateParams.episodeId).then(function(data){
        $ionicLoading.hide();
        $scope.episode = data.data[0];
        $scope.audio = ngAudio.load($scope.episode.fields.audio_file_path);
    }, function(){
        $ionicLoading.show({template: 'Something went wrong...', duration: 2000});
    })
})

.directive('backImg', function(){
        return function(scope, element, attrs){
                var url = attrs.backImg;
                var content = element.find('a');
                content.css({
                        'background-image': 'url(' + url +')',
                        'background-size' : 'cover'
                });
        };
})
.directive('seekbar', function($window){
    var template = '<input class="form-control seekbar" type="range" min="0" max="1" step="0.01">'
    var getTrackStyle = function (el) {
        var curVal = el.val() * 100,
            style = {},
            cssOutput = 'linear-gradient(to right, #ffab40 0%, #ffab40 ' + curVal + '%, #ddd ' + curVal + '%, #ddd 100%)';
        style['background'] = cssOutput;
        return style;
        };

        var prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];
        sheet = $window.document.createElement('style');
        $window.document.body.appendChild(sheet);
        return {
            restrict: 'E',
            template: template,
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            replace: true,
            link: function(scope, element, attrs, ngModel) {
                scope.$watch("model", function(oldVar, newVar){
                    var css = getTrackStyle(element);
                    element.css(css);
                })
            }
        };
});
;
