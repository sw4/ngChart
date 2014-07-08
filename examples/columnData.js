ngChart.controller("barData", ['$scope', '$interval',
function ($scope,$interval) {
    $scope.data=[
    {category:5,y:8},
    {category:8,y:2},
    {category:1,y:9},
    {category:4,y:5},
    {category:6,y:2},
    {category:7,y:6},
    {category:1,y:2}
    ];
    
    $interval(function() {
        $scope.data[0].y=Math.floor(Math.random() * (9 - 2 + 1)) + 2;
    }, 500);  
    
    
}]);