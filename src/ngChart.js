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
        template:"<div id='{{chartId}}' class='ngChart'><svg ng-chart={{type}}></svg></div>",
        scope:{
            x:'@',
            y:'@',
            data:'@',
            margin:'@',
            type:'@',
            title:'@',
            resize:'@'
        },
        controller:function($scope){
            $scope.chartId='ngChart_'+Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
            $scope.rawData=$scope.$parent[$scope.data];
            $scope.$watch('$scope.$parent.data', function(newV){
                    // console.log(newV);
            });
        }
    }
}]);

ngChart.addResizeEvent = function(func) {
    var oldResize = window.onresize;
    window.onresize = function () {
        func();
        if (typeof oldResize === 'function') {
            oldResize();
        }
    };
}

ngChart.directive("ngChart", ['$compile', '$http', '$templateCache', function ( $compile, $http, $templateCache) {

    function template(type){
        switch(type){
            case "column":
                return "<svg  ng-height='{{svgHeight+offset.top+offset.bottom}}' ng-width='{{svgWidth+offset.left+offset.right}}'>\
                    <text class='title' ng-x='{{svgWidth/2}}' ng-y='25'>{{title}}</text>\
                    <g>\
                    <rect ng-repeat='item in rawData' ng-x='{{item.svgX}}'  ng-y='{{item.svgY}}' ng-height='{{item.svgHeight}}px' ng-width='{{item.svgWidth}}px'>\
                    </rect>\
                    </g>\
                    <g>\
                        <g class='axis yAxis' ng-transform='translate({{offset.left}},{{offset.top}})'>\
                            <line ng-y2='{{svgHeight}}'></line>\
                            <g ng-transform='translate(-5,{{$index*tickOffset}})'  ng-repeat='tick in ticksY'>\
                                <line ng-x2='5'></line>\
                                <text ng-y='5'>{{tick.value}}</text>\
                            </g>\
                        </g>\
                        <g class='axis xAxis' ng-transform='translate({{offset.left}},{{svgHeight+offset.bottom}})'>\
                            <line ng-x2='{{svgWidth}}'></line>\
                            <g ng-transform='translate({{item.svgX-offset.left+(item.svgWidth/2)}},0)' ng-repeat='item in rawData'>\
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
        
            var offset=null,svgHeight=0,svgWidth=0,x=[],y=[],maxWidth=0,maxHeight=0,maxX=0, minX=0, maxY=0, minY=0;

            function render(element){

        
            var ngChartEl=element || $element[0];
            
                offset=$scope.margin;
                if(offset.split(',').length > 1){
                    offset=offset.split(',');
                    $scope.offset={
                        top:parseInt(offset[0]),
                        right:parseInt(offset[1]),
                        bottom:parseInt(offset[2]),
                        left:parseInt(offset[3])
                    }; 
                }else{
                    offset=parseInt(offset);
                    $scope.offset={
                        top:offset,
                        right:offset,
                        bottom:offset,
                        left:offset
                    };   
                }        

                svgHeight=ngChartEl.offsetHeight|| ngChartEl.clientHeight || (ngChartEl.parentNode && ngChartEl.parentNode.clientHeight) || 0;
                svgWidth=ngChartEl.offsetWidth||ngChartEl.clientWidth || (ngChartEl.parentNode && ngChartEl.parentNode.clientWidth) || 0;

                svgHeight=svgHeight-$scope.offset.top-$scope.offset.bottom,
                svgWidth=svgWidth-$scope.offset.left-$scope.offset.right,

                $scope.svgHeight=svgHeight;
                $scope.svgWidth=svgWidth;
            }
            render();
            function dataChange(){            
                $scope.rawData.forEach(function(item){
                    x.push(item[$scope.x]);
                    y.push(item[$scope.y]);
                });
                maxHeight = maxY = Math.max.apply(null, y);   
                $scope.maxWidth = maxWidth=svgWidth/$scope.rawData.length;  
                minY = Math.min.apply(null, y);      
                maxX = Math.max.apply(null, x);      
                minX = Math.min.apply(null, x);      
                $scope.rawData.forEach(function(item, index){
                    item.svgHeight=Math.round((item[$scope.y]/maxHeight)*svgHeight);
                    item.svgWidth=maxWidth;
                    item.svgX=(maxWidth*index)+$scope.offset.left;
                    item.svgY=(svgHeight-item.svgHeight)+$scope.offset.top;
                });   

                $scope.ticksY=[];  
                $scope.tickCount=20;
                $scope.tickOffset=svgHeight/$scope.tickCount;    
                var tickStep=(maxY-minY) /$scope.tickCount;
                for(i=$scope.tickCount;i>=0;i--){
                    var v=minY+(tickStep*i);
                    $scope.ticksY.push({value:v.toFixed(2)});
                }    
            };
            $scope.$watch('rawData', function(n, o){     
               dataChange();
            },true);

            function onResize(){
                render(angular.element(document.getElementById($scope.chartId))[0]);
                dataChange();
            }
            $scope.resize && ngChart.addResizeEvent(onResize);            
        },        
        link:function(scope, element, attrs){
            element.html(template(scope.type));        
            element.replaceWith($compile(element.html())(scope));
        }
    }
}]);