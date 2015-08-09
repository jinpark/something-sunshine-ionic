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
        }, function(){
                $ionicLoading.show({template: 'Something went wrong...', duration: 2000});
        })

})

.controller('EpisodeCtrl', function($scope, $stateParams, $window, $http, $ionicLoading, ngAudio) {
        $scope.audio = null;
        $scope.waiting = false;
        $ionicLoading.show({template: 'Loading'});
        $scope.loading = true;
        $scope.played = false;
        $scope.seeking = false;
        $http.get('http://www.somethingsunshine.com/api/episode/' + $stateParams.episodeId).then(function(data){
            $ionicLoading.hide();
            $scope.loading = false;
            $scope.episode = data.data[0];
            $scope.audio = ngAudio.load($scope.episode.fields.audio_file_path);
            $scope.onTap = function(e) {
              if(ionic.Platform.isIOS()) {
                $scope.audio.pause();
                $scope.audio.progress = (e.target.max / e.target.offsetWidth)*(e.gesture.touches[0].clientX - 10 - e.target.offsetLeft);
              }
            };
        }, function(){
            $scope.loading = false;
            $ionicLoading.show({template: 'Something went wrong...', duration: 2000});
        });
        $scope.playAudio = function(){
            if ($scope.audio.paused) {
                $scope.played = true;
                $scope.audio.play();
            } else {
                $scope.audio.pause();
            }
        };
        $scope.$watch('audio.paused', function(newVal, oldVal){
            console.log(['audio.paused', newVal]);
        });
        $scope.$watch('audio.audio.seeking', function(newVal, oldVal){
            console.log(['seeking', newVal, oldVal]);
            if (newVal){
                $scope.seeking = true;
            } else if (!newVal && !$scope.played) {
                $scope.seeking = false;
            } else {
                $scope.seeking = false;
                $scope.audio.play();
            }
        });
        $scope.$watch('audio.audio.readyState', function(newVal, oldVal){
                console.log(['watching', newVal, oldVal]);
                if (newVal == 4 || newVal == 3) {
                    $scope.waiting = false;
                } else {
                    $scope.waiting = true;
                }
        });
        $scope.$on('$ionicView.leave', function(){
            if ($scope.audio){
                $scope.audio.stop();
            }
        });        
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
    var template = '<input class="form-control seekbar" type="range" min=0 max=1 step=0.01 value=0>'
    var getTrackStyle = function (el, value) {
        var curVal = value || 0,
            style = {},
            cssOutput = 'linear-gradient(to right, #ffab40 0%, #ffab40 ' + curVal * 100 + '%, #ddd ' + curVal * 100 + '%, #ddd 100%)';
        style['background'] = cssOutput;
        return style;
    };
    var prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];
    return {
        restrict: 'E',
        template: template,
        require: 'ngModel',
        scope: {
            model: '=ngModel'
        },
        replace: true,
        link: function(scope, element, attrs, ngModel) {
            scope.$watch("model", function(oldVal, newVal){
                var css = getTrackStyle(element, newVal);
                element.css(css);
            })
        }
    };
});

