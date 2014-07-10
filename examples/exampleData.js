ngChart.controller("exampleData", ['$scope', '$interval',
function ($scope,$interval) {

    $scope.ngChart={
        type:"bar",
        title:'chart',
        data: [
            {category:"cat",y:8, y2:2},
            {category:"pig",y:2, y2:6},
            {category:"cow",y:9, y2:9},
            {category:"bird",y:5, y2:2},
            {category:"dog",y:2, y2:7},
            {category:"emu",y:6, y2:3},
            {category:"hamster",y:2, y2:3}
        ],
        margin: 60,
        resize:true,
        legend: true,
        xAxis: {
            values: "y"
        },
        yAxis: {
            values: "category"
        },
        series: [{
            values: "y"
        },{
            values: "y2"
        }]
    };
    
    $interval(function() {
    //    $scope.ngChart.data[0].y=Math.floor(Math.random() * (9 - 2 + 1)) + 2;
    }, 500); 
    
}]);