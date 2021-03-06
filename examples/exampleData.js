ngChart.controller("exampleDataSetA", ['$scope', '$interval',
function ($scope,$interval) {
    $scope.ngChart={
        type:"bar",
        title:'Example Bar Chart (config in controller)',
        data: [
            {category:"cat",y:8, y2:2},
            {category:"pig",y:1, y2:6},
            {category:"cow",y:9, y2:9},
            {category:"bird",y:5, y2:2},
            {category:"dog",y:2, y2:7},
            {category:"emu",y:6, y2:3},
            {category:"hamster",y:2, y2:3}
        ],
        margin: 35,
        resize:true,
        legend: true,
        tick:{
            interval:9
        },
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
}]);

ngChart.controller("exampleDataSetB", ['$scope', '$interval',
function ($scope,$interval) {
    $scope.ngChart={
        type:"bar",
        title:'Example Bar Chart (config in controller)',
        data: [
            {category:"cat",y:8, y2:2},
            {category:"pig",y:-1, y2:6},
            {category:"cow",y:9, y2:-9},
            {category:"bird",y:5, y2:2},
            {category:"dog",y:-2, y2:7},
            {category:"emu",y:6, y2:-3},
            {category:"hamster",y:2, y2:3}
        ],
        margin: 35,
        resize:true,
        legend: true,
        tick:{
            interval:18
        },
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
}]);