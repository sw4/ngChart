var ngChart = angular.module('ngChart', []);

ngChart.controller("ngChart", [ '$scope', '$timeout',
function ( $scope, $timeout) {
}]);

angular.forEach(['transform','x1','x2','y1','y2','x', 'y', 'width', 'height'], function(name) {
  var ngName = 'ng' + name[0].toUpperCase() + name.slice(1);
  ngChart.directive(ngName, function() {
    return function(scope, element, attrs) {
      attrs.$observe(ngName, function(value) {
        attrs.$set(name, value); 
      })
    };
  });
});

ngChart.directive("ngChart", [function () {
    return {
        restrict: "E",
        replace: true,
        transclude: false,
        template:"<div class='ngChart'><svg ng-controller='ngChart' ng-chart={{type}}></svg></div>",
        scope:{
            x:'@',
            y:'@',
            data:'@',
            margin:'@',
            type:'@',
            title:'@'
        }, 
        link:function(scope, element, attrs){          
            scope.type=attrs.type || scope.type ||  'column';
            scope.x=scope.x || attrs.x;
            scope.y=scope.y || attrs.y;            
            scope.margin=scope.margin || attrs.margin;   
        }
    }
}]);

ngChart.directive("ngChart", ['$compile', '$http', '$templateCache', function ( $compile, $http, $templateCache) {

    function template(type){
        switch(type){
            case "column":
                return "<svg ng-height='{{svgHeight+margin.top+margin.bottom}}' ng-width='{{svgWidth+margin.left+margin.right}}'>\
                    <text class='title' ng-x='{{svgWidth/2}}' ng-y='25'>{{title}}</text>\
                    <g>\
                    <rect ng-repeat='item in data' ng-x='{{item.svgX}}'  ng-y='{{item.svgY}}' ng-height='{{item.svgHeight}}px' ng-width='{{item.svgWidth}}px'></rect>\
                    </g>\
                    <g>\
                        <g class='axis yAxis' ng-transform='translate({{margin.left}},{{margin.top}})'>\
                            <line ng-y2='{{svgHeight}}'></line>\
                            <g ng-transform='translate(-5,{{$index*tickOffset}})'  ng-repeat='tick in ticksY'>\
                                <line ng-x2='5'></line>\
                                <text ng-y='5'>{{tick.value}}</text>\
                            </g>\
                        </g>\
                        <g class='axis xAxis' ng-transform='translate({{margin.left}},{{svgHeight+margin.bottom}})'>\
                            <line ng-x2='{{svgWidth}}'></line>\
                            <g ng-transform='translate({{item.svgX-margin.left+(item.svgWidth/2)}},0)' ng-repeat='item in data'>\
                                <line ng-y2='5'></line>\
                                <text ng-y='20'>{{item[x]}}</text>\
                            </g>\
                        </g>\
                    </svg>"
            break;
        }
    };
    return {
        restrict: "A",
        replace: true,
        transclude: false,
        controller: function($scope, $element){
            $scope.data=$scope.$parent.$parent.data;
            $scope.x=$scope.$parent.x;
            $scope.y=$scope.$parent.y;            
            var margin=$scope.$parent.margin;
            if(margin.split(',').length > 1){
                margin=margin.split(',');
                $scope.margin={
                    top:parseInt(margin[0]),
                    right:parseInt(margin[1]),
                    bottom:parseInt(margin[2]),
                    left:parseInt(margin[3])
                }; 
            }else{
                margin=parseInt(margin);
                $scope.margin={
                    top:margin,
                    right:margin,
                    bottom:margin,
                    left:margin
                };   
            }             
            var svgHeight=$element[0].offsetHeight|| $element[0].clientHeight || $element[0].parentNode.clientHeight,
                svgWidth=$element[0].offsetWidth||$element[0].clientWidth || $element[0].parentNode.clientWidth,
                x=[],
                y=[], 
                maxWidth=0, 
                maxHeight=0,
                maxX, minX, maxY, minY;

            svgHeight=svgHeight-$scope.margin.top-$scope.margin.bottom,
            svgWidth=svgWidth-$scope.margin.left-$scope.margin.right,


            $scope.svgHeight=svgHeight;
            $scope.svgWidth=svgWidth;
            $scope.data.forEach(function(item){
                x.push(item[$scope.x]);
                y.push(item[$scope.y]);
            });
            maxHeight = maxY = Math.max.apply(null, y);   
            $scope.maxWidth = maxWidth=svgWidth/$scope.data.length;  
            minY = Math.min.apply(null, y);      
            maxX = Math.max.apply(null, x);      
            minX = Math.min.apply(null, x);      
            $scope.data.forEach(function(item, index){
                item.svgHeight=Math.round((item[$scope.y]/maxHeight)*svgHeight);
                item.svgWidth=maxWidth;
                item.svgX=(maxWidth*index)+$scope.margin.left;
                item.svgY=(svgHeight-item.svgHeight)+$scope.margin.top;
            });   
                $scope.$watch('data', function(newV){
                    // console.log(newV);
                })
            $scope.ticksY=[];  
            $scope.tickCount=20;
            $scope.tickOffset=svgHeight/$scope.tickCount;    
            var tickStep=(maxY-minY) /$scope.tickCount;
            for(i=$scope.tickCount;i>=0;i--){
                var v=minY+(tickStep*i);
                $scope.ticksY.push({value:v.toFixed(2)});
            }                
        },        
        link:function(scope, element, attrs){  

            element.html(template(scope.type));        
            element.replaceWith($compile(element.html())(scope)); 
        }
    }
}]);