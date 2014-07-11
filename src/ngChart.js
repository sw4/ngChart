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
            attr_xValues:'@xvalues',
            attr_yValues:'@yvalues',
            attr_margin:'@margin',
            attr_type:'@type',
            attr_title:'@title',
            attr_resize:'@resize'
        },
        controller:function($scope){
            $scope.chartId='ngChart_'+Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
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

ngChart.directive("ngChart", ['$compile', '$http', '$templateCache', '$interval', function ( $compile, $http, $templateCache,$interval) {

    function template(type){
        switch(type){
            case "bar":
                return "<svg  ng-height='{{svgHeight+offset.top+offset.bottom}}' ng-width='{{svgWidth+offset.left+offset.right}}'>\
                    <text class='title' ng-x='{{svgWidth/2}}' ng-y='25'>{{title}}</text>\
                    <g class='grid' ng-transform='translate({{offset.left}},{{svgHeight+offset.bottom}})'>\
                        <line  ng-transform='translate({{$index*tickOffsetX}},0)'  ng-repeat='tick in ticksX' class='grid' ng-y1='-6' ng-y2='-{{svgHeight-1}}'></line>\
                    </g>\
                    <g class='items'>\
                    <rect class='{{item.css}} i_{{$index}}' ng-repeat='item in itemData' ng-x='{{item.x}}'  ng-y='{{item.y}}' ng-height='{{item.height}}px' ng-width='{{item.width}}px'></rect>\
                    </g>\
                    <g class='axes'>\
                        <g class='axis yAxis' ng-transform='translate({{offset.left}},{{offset.top}})'>\
                            <line ng-y2='{{svgHeight}}'></line>\
                            <g class='tick c_{{data[$index][xAxis.values]}} i_{{$index}}' ng-transform='translate(-5,{{(svgHeight/data.length)*$index + (svgHeight/data.length/2)}})' ng-repeat='item in data'>\
                                <line class='bracket' ng-x1='5' ng-x2='5' ng-y1='-{{(svgHeight/data.length/2)}}' ng-y2='{{(svgHeight/data.length/2)}}'></line>\
                                <line ng-x2='5'></line>\
                                <text ng-y='2' ng-x='-3'>{{data[$index][yAxis.values]}}</text>\
                            </g>\
                        </g>\
                        <g class='axis xAxis' ng-transform='translate({{offset.left}},{{svgHeight+offset.bottom}})'>\
                            <line ng-x2='{{svgWidth}}'></line>\
                            <g class='tick' ng-transform='translate({{$index*tickOffsetX}},0)'  ng-repeat='tick in ticksX'>\
                                <line ng-y2='5'></line>\
                                <text ng-y='17'>{{tick.value}}</text>\
                            </g>\
                        </g>\
                    </g>\
                </svg>"
            break;
            case "column":
                return "<svg  ng-height='{{svgHeight+offset.top+offset.bottom}}' ng-width='{{svgWidth+offset.left+offset.right}}'>\
                    <text class='title' ng-x='{{svgWidth/2}}' ng-y='25'>{{title}}</text>\
                    <g class='grid' ng-transform='translate({{offset.left}},{{offset.top}})'>\
                        <line ng-transform='translate(-5,{{$index*tickOffsetY}})'  ng-repeat='tick in ticksY' class='grid' ng-x1='6' ng-x2='{{svgWidth-1}}'></line>\
                    </g>\
                    <g class='items'>\
                        <rect class='{{item.css}} i_{{$index}}' ng-repeat='item in itemData' ng-x='{{item.x}}'  ng-y='{{item.y}}' ng-height='{{item.height}}px' ng-width='{{item.width}}px'></rect>\
                    </g>\
                    <g class='axes'>\
                        <g class='axis yAxis' ng-transform='translate({{offset.left}},{{offset.top}})'>\
                            <line ng-y2='{{svgHeight}}'></line>\
                            <g class='tick' ng-transform='translate(-5,{{$index*tickOffsetY}})'  ng-repeat='tick in ticksY'>\
                                <line ng-x2='5'></line>\
                                <text ng-y='5' ng-x='-3'>{{tick.value}}</text>\
                            </g>\
                        </g>\
                        <g class='axis xAxis' ng-transform='translate({{offset.left}},{{svgHeight+offset.bottom}})'>\
                            <line ng-x2='{{svgWidth}}'></line>\
                            <g class='tick c_{{data[$index][xAxis.values]}} i_{{$index}}' ng-transform='translate({{(svgWidth/data.length)*$index + (svgWidth/data.length/2)}},0)' ng-repeat='item in data'>\
                                <line class='bracket' ng-x1='-{{(svgWidth/data.length/2)}}' ng-x2='{{(svgWidth/data.length/2)}}'></line>\
                                <line ng-y2='5'></line>\
                                <text ng-y='17'>{{data[$index][xAxis.values]}}</text>\
                            </g>\
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
            // for the directive scope - link to element attributes if present/settable, or fetch from the parent controller
            $scope.data=$scope.$parent.ngChart.data;
            $scope.margin=parseInt($scope.attr_margin || $scope.$parent.ngChart.margin);
            $scope.type=($scope.attr_type || $scope.$parent.ngChart.type).toString();            
            $scope.title=($scope.attr_title || $scope.$parent.ngChart.title).toString();
            $scope.resize=$scope.attr_resize || $scope.$parent.ngChart.resize;
            if(typeof $scope.resize=='string'){
                $scope.resize = ($scope.resize === 'true');
            }
            // create new property...or link to parent
            $scope.xAxis={
                values:($scope.attr_xValues || $scope.$parent.ngChart.xAxis.values).toString()
            };   
            $scope.yAxis={
                values:($scope.attr_yValues || $scope.$parent.ngChart.yAxis.values).toString()
            };    
            $scope.tick={
                interval:$scope.attr_tickInterval || $scope.$parent.ngChart.tick.interval
            };    
            $scope.series=$scope.$parent.ngChart.series;
            
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
                tickStepX=0,
                offsetX=0,
                bandX=0,
                baseX=0,
                offsetY=0,
                bandY=0,
                baseY=0;

            function render(element){        
                var ngChartEl=element || $element[0];
                offset=$scope.margin;
                if(typeof offset == "string" && offset.split(',').length > 1){
                    offset=offset.split(',');
                    $scope.offset={
                        top:parseInt(offset[0]),
                        right:parseInt(offset[1]),
                        bottom:parseInt(offset[2]),
                        left:parseInt(offset[3])
                    }; 
                }else if(typeof offset == "string" || typeof offset == "number"){
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
                $scope.data.forEach(function(item){
                    x.push(item[$scope.xAxis.values]);
                    y.push(item[$scope.yAxis.values]);
                });
                
                        
                minY = Math.min.apply(null, y);               
                maxY = Math.max.apply(null, y); 
                minY=minY > 0 ? 0 : minY;    
                         
                maxX = Math.max.apply(null, x);      
                minX = Math.min.apply(null, x);                
                minX=minX > 0 ? 0 : minX; 
                
                // get max value offset from zero
                if(Math.abs(minX)>Math.abs(maxX)){
                    offsetX=Math.abs(minX);                    
                }else{
                    offsetX=Math.abs(maxX);
                }
                // get actual scale size
                if(minX<0 && maxX >0){
                    bandX=offsetX*2;       
                    baseX=svgWidth*.5;
                    minX=offsetX*-1;
                    maxX=offsetX;
                }else{
                    bandX=offsetX;
                    offsetX=0;
                    baseX=0;
                }
                // get max value offset from zero
                if(Math.abs(minY)>Math.abs(maxY)){
                    offsetY=Math.abs(minY);                    
                }else{
                    offsetY=Math.abs(maxY);
                }
                // get actual scale size
                if(minY<0 && maxY >0){
                    bandY=offsetY*2;       
                    baseY=svgHeight*.5;
                    minY=offsetY*-1;
                    maxY=offsetY;
                }else{
                    bandY=offsetY;
                    offsetY=0;
                    baseY=svgHeight;
                }
                
                rangeX=bandX;
                rangeY=bandY;       
                switch($scope.type){
                    case "column":          
                        maxWidth=svgWidth/$scope.data.length/$scope.series.length;
                        $scope.data.forEach(function(item, index){
                            $scope.series.forEach(function(serie, series){         
                                var height=Math.abs(Math.round((item[serie.values]/rangeY)*svgHeight));                                 
                                $scope.itemData.push({
                                    height:height,
                                    width:maxWidth,
                                    x:(maxWidth*index)*$scope.series.length + (series*maxWidth)+$scope.offset.left,// 
                                    y:item[serie.values]<0 ? $scope.offset.top+baseY : $scope.offset.top+baseY-height,
                                    css:'s_'+series+' c_'+item[$scope.xAxis.values]+' v_'+item[$scope.yAxis.values]
                                });
                            }); 
                        });
                    break;                        
                    case "bar":             
                        maxHeight=svgHeight/$scope.data.length/$scope.series.length;
                        $scope.data.forEach(function(item, index){
                            $scope.series.forEach(function(serie, series){
                                var width=Math.round((Math.abs(item[serie.values])/rangeX)*svgWidth);  
                                $scope.itemData.push({
                                    height:maxHeight,
                                    width:width,
                                    x:item[serie.values]<0 ? $scope.offset.left+(svgWidth*(item[serie.values]+offsetX)/bandX) : $scope.offset.left+baseX,
                                    y:(maxHeight*index)*$scope.series.length + (series*maxHeight)+$scope.offset.left,
                                    css:'s_'+series+' c_'+item[$scope.yAxis.values]+' v_'+item[$scope.xAxis.values]
                                });
                            });                            
                        });                       
                    break;
                }
                
                $scope.tickGapY=20;
                $scope.tickGapX=40;
                $scope.ticksY=[];
                $scope.ticksX=[];
                // how many ticks will fit?
                
                if(!$scope.tick.interval || isNaN($scope.tick.interval)){
                    tickCountY=Math.round(svgHeight/$scope.tickGapY);
                    tickCountX=Math.round(svgWidth/$scope.tickGapX);
                }else{
                    tickCountY=$scope.tick.interval;
                    tickCountX=$scope.tick.interval;
                };
                
                
                
                // re-factor offset between ticks at that amount
                $scope.tickOffsetY=svgHeight/tickCountY;   
                $scope.tickOffsetX=svgWidth/tickCountX;  
                
                tickStepY=(maxY-minY) /tickCountY;
                tickStepX=(maxX-minX) /tickCountX;               
                
                for(i=tickCountY;i>=0;i--){
                    var v=minY+(tickStepY*i);
                    $scope.ticksY.push({value:v});
                }    
                for(i=0;i<=tickCountX;i++){
                    var v=minX+(tickStepX*i);
                    $scope.ticksX.push({value:v});
                }                               
            };
            
            
            $scope.$watch('data', function(n, o){     
               o!== undefined && n!== undefined && dataChange();
            },true);
            
            if($scope.resize){
                $scope.chartWidth=0;
                $scope.chartHeight=0;
                var resizing=false;
                $interval(function(){                
                    ngChartEl=angular.element(document.getElementById($scope.chartId))[0];
                    var newHeight=ngChartEl.offsetHeight|| ngChartEl.clientHeight || (ngChartEl.parentNode && ngChartEl.parentNode.clientHeight) || 0;
                    var newWidth=ngChartEl.offsetWidth||ngChartEl.clientWidth || (ngChartEl.parentNode && ngChartEl.parentNode.clientWidth) || 0;
                    if(newHeight != $scope.chartHeight || newWidth != $scope.chartWidth){ 
                        if($scope.chartHeight !=0 && $scope.chartWidth !=0){
                            resizing=true; 
                        }
                        $scope.chartWidth=newWidth;
                        $scope.chartHeight=newHeight;                        
                    }else{
                        if(resizing==true){
                            render(ngChartEl);
                            dataChange();
                        };
                        resizing=false;                  
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