ngChart.controller("exampleData", ['$scope', '$interval',
function ($scope,$interval) {


    $scope.ngChart={
        type:"bar",
        title:'chart',
        data: [
            {category:"cat",y:8},
            {category:"pig",y:2},
            {category:"cow",y:9},
            {category:"bird",y:5},
            {category:"dog",y:2},
            {category:"emu",y:6},
            {category:"hamster",y:2}
        ],
        margin: 60,
        resize:false,
        legend: true,
        xAxis: {
            values: "y"
        },
        yAxis: {
            values: "category"
        },
        series: [{
            values: "y"
        }]
    };
    
    $interval(function() {
     //   $scope.data[0].y=Math.floor(Math.random() * (9 - 2 + 1)) + 2;
    }, 500); 
    
}]);