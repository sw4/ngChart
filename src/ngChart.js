var ngChart = angular.module('ngChart', []);


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
            margin:'@',
            type:'@',
            title:'@',
            resize:'@',
            data:'@'
        },
        controller:function($scope){
            $scope.chartId='ngChart_'+Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
            $scope.rawData=$scope.$parent[$scope.data];
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
            case "bar":
                return "<svg  ng-height='{{svgHeight+offset.top+offset.bottom}}' ng-width='{{svgWidth+offset.left+offset.right}}'>\
                    <text class='title' ng-x='{{svgWidth/2}}' ng-y='25'>{{title}}</text>\
                    <g>\
                    <rect ng-repeat='item in itemData' ng-x='{{offset.left}}'  ng-y='{{item.svgY}}' ng-height='{{item.svgHeight}}px' ng-width='{{item.svgWidth}}px'>\
                    </rect>\
                    </g>\
                    <g>\
                        <g class='axis yAxis' ng-transform='translate({{offset.left}},{{offset.top}})'>\
                            <line ng-y2='{{svgHeight}}'></line>\
                            <g ng-transform='translate(-5,{{item.svgY-offset.top+(item.svgHeight/2)}})' ng-repeat='item in itemData'>\
                                <line ng-x2='5'></line>\
                                <text ng-y='5'>{{rawData[$index][y]}}</text>\
                            </g>\
                        </g>\
                        <g class='axis xAxis' ng-transform='translate({{offset.left}},{{svgHeight+offset.bottom}})'>\
                            <line ng-x2='{{svgWidth}}'></line>\
                            <g ng-transform='translate({{$index*tickOffsetX}},0)'  ng-repeat='tick in ticksX'>\
                                <line ng-y2='5'></line>\
                                <text ng-y='20'>{{tick.value}}</text>\
                            </g>\
                        </g>\
                    </svg>"
            break;
            case "column":
                return "<svg  ng-height='{{svgHeight+offset.top+offset.bottom}}' ng-width='{{svgWidth+offset.left+offset.right}}'>\
                    <text class='title' ng-x='{{svgWidth/2}}' ng-y='25'>{{title}}</text>\
                    <g>\
                    <rect ng-repeat='item in itemData' ng-x='{{item.svgX}}'  ng-y='{{item.svgY}}' ng-height='{{item.svgHeight}}px' ng-width='{{item.svgWidth}}px'>\
                    </rect>\
                    </g>\
                    <g>\
                        <g class='axis yAxis' ng-transform='translate({{offset.left}},{{offset.top}})'>\
                            <line ng-y2='{{svgHeight}}'></line>\
                            <g ng-transform='translate(-5,{{$index*tickOffsetY}})'  ng-repeat='tick in ticksY'>\
                                <line ng-x2='5'></line>\
                                <text ng-y='5'>{{tick.value}}</text>\
                            </g>\
                        </g>\
                        <g class='axis xAxis' ng-transform='translate({{offset.left}},{{svgHeight+offset.bottom}})'>\
                            <line ng-x2='{{svgWidth}}'></line>\
                            <g ng-transform='translate({{item.svgX-offset.left+(item.svgWidth/2)}},0)' ng-repeat='item in itemData'>\
                                <line ng-y2='5'></line>\
                                <text ng-y='20'>{{rawData[$index][x]}}</text>\
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
         
            var offset=null,
                svgHeight=0,
                svgWidth=0,
                x=[],
                y=[],
                maxWidth=0,
                maxHeight=0,
                maxX=0, 
                minX=0, 
                maxY=0, 
                minY=0,
                tickCountX=0,
                tickCountY=0,
                tickStepY=0,
                tickStepX=0;

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
                $scope.itemData=[];
                $scope.rawData.forEach(function(item){
                    $scope.itemData.push({});
                    x.push(item[$scope.x]);
                    y.push(item[$scope.y]);
                });
                
                minY = Math.min.apply(null, y);      
                maxY = Math.max.apply(null, y);     
                maxX = Math.max.apply(null, x);      
                minX = Math.min.apply(null, x);  

                switch($scope.type){
                    case "column":
                        maxHeight = maxY;   
                        maxWidth=svgWidth/$scope.rawData.length;  
                        $scope.rawData.forEach(function(item, index){                        
                            $scope.itemData[index].svgHeight=Math.round((item[$scope.y]/maxHeight)*svgHeight);
                            $scope.itemData[index].svgWidth=maxWidth;
                            $scope.itemData[index].svgX=(maxWidth*index)+$scope.offset.left;
                            $scope.itemData[index].svgY=(svgHeight-$scope.itemData[index].svgHeight)+$scope.offset.top;
                        });
                    break;                        
                    case "bar":
                        maxWidth = maxX;
                        maxHeight=svgHeight/$scope.rawData.length;  
                        $scope.rawData.forEach(function(item, index){ 
                            $scope.itemData[index].svgWidth=Math.round((item[$scope.x]/maxWidth)*svgWidth);
                            $scope.itemData[index].svgHeight=maxHeight;                            
                            $scope.itemData[index].svgX=(svgWidth-$scope.itemData[index].svgWidth)+$scope.offset.left;
                            $scope.itemData[index].svgY=(maxHeight*index)+$scope.offset.top;   
                        });                        
                    break;
                }
                    

                $scope.tickGapY=20;
                $scope.tickGapX=40;
                $scope.ticksY=[];
                $scope.ticksX=[];
                // how many ticks will fit?
                tickCountY=Math.round(svgHeight/$scope.tickGapY);
                tickCountX=Math.round(svgWidth/$scope.tickGapX);
                
                // re-factor offset between ticks at that amount
                $scope.tickOffsetY=svgHeight/tickCountY;   
                $scope.tickOffsetX=svgWidth/tickCountX;  
                
                tickStepY=(maxY-minY) /tickCountY;
                tickStepX=(maxX-minX) /tickCountX;               
                
                for(i=tickCountY;i>=0;i--){
                    var v=minY+(tickStepY*i);
                    $scope.ticksY.push({value:v.toFixed(2)});
                }    
                for(i=0;i<=tickCountX;i++){
                    var v=minX+(tickStepX*i);
                    $scope.ticksX.push({value:v.toFixed(2)});
                }                               
            };
            $scope.$watch('rawData', function(n, o){     
               o!== undefined && n!== undefined && dataChange();
            },true);
            
            if($scope.resize){
                $scope.chartWidth=0;
                $scope.chartHeight=0;
                setInterval(function(){
                    ngChartEl=angular.element(document.getElementById($scope.chartId))[0];
                    var newHeight=ngChartEl.offsetHeight|| ngChartEl.clientHeight || (ngChartEl.parentNode && ngChartEl.parentNode.clientHeight) || 0;
                    var newWidth=ngChartEl.offsetWidth||ngChartEl.clientWidth || (ngChartEl.parentNode && ngChartEl.parentNode.clientWidth) || 0;
                    if(newHeight != $scope.chartHeight || newWidth != $scope.chartWidth){                    
                        $scope.chartWidth=newWidth;
                        $scope.chartHeight=newHeight;
                        render(ngChartEl);
                        dataChange();
                    }
                },200);
            }
        },        
        link:function(scope, element, attrs){
            element.html(template(scope.type));        
            element.replaceWith($compile(element.html())(scope));
        }
    }
}]);