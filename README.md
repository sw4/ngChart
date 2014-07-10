ngChart
==========

Pure Angular SVG Charting

Not production-ready. This library is in its infancy.

**Licensed under [cc by-sa 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with attribution required**

**Work in progress - very rough code**


###About###

The purpose of this project is to implement SVG based charting using native angular techniques and no reliance on external libraries (jQuery, d3 etc).

Check the examples folder for current examples. 

###[Live Demo](https://rawgit.com/sw4/ngChart/master/examples/example.html)###

###Key Development Tenets###

Only use Angular or Vanilla Javascript

Maintain seperation of concerns - all styling kept to CSS, content HTML, functionality JS

Adhere to Angular design principles

Adhere to JS best practice

Charts should be declarative

###Usage###

Include the `ngChart.js` and `ngChart.css` files, to use:

```html
<ng-chart ng-controller='yourController' type='column' xValues='category' yValues='y' resize='true'></ng-chart>
```

Where `ng-controller` is the name of the controller to use to source chart data, a controller can be applied to the directive (`<ng-chart />`) element itself, or to its parent.


#####$scope.ngChart#####

The parent scope for any ngChart must have an ngChart property of the following format:

```javascript


    $scope.ngChart={
        type:"bar",// (string) (optional if set on directive element) - chart type (bar/column)
        title:'chart',// (string) (optional if set on directive element) - chart title
        data: [//(object array) (required)
            {category:"cat",y:8, y2:2},
            {category:"pig",y:2, y2:6},
            {category:"cow",y:9, y2:9},
            {category:"bird",y:5, y2:2},
            {category:"dog",y:2, y2:7},
            {category:"emu",y:6, y2:3},
            {category:"hamster",y:2, y2:3}
        ],
        tick:{ // (object) (optional) tick configuration
            interval:9 // how many ticks to place on value axis, if not specified- calculated automatically given available space
        },
        margin: 60,// (number/object) (optional if set on directive element) - chart margins, can be number or object (top, right, bottom, left)
        resize:false,// (bool) (optional if set on directive element) - chart automatically resize on parent element resize
        legend: true,// (bool) (optional if set on directive element) - show chart legend
        xAxis: {// (object) (optional if xValues set on directive element) - source of x axis values in 'data'
            values: "y"
        },
        yAxis: {// (object) (optional if yValues set on directive element) - source of y axis values in 'data'
            values: "category"
        },
        series: [{// (object array) - source of series axis values in 'data'
            values: "y"
        },{
            values: "y2"
        }]
    };
    
    
```

#####Directive Element Attributes#####

The below attributes can be set on the directive element to override the equivalent controller settings to allow a single ngChart controller to be shared by different charts.

`xValues` (string) the source of data for the X Axis (key name)

`yValues` (string) the source of data for the Y Axis (key name)

`margin` (number/csv) chart margins, either number or comma seperated values (top,right,bottom,left)

`type` (string) the chart type (currently only supports bar/column)

`title` (string) the chart title

`resize` (bool) whether to resize the chart if the parent container changes size


#####Styling#####

To maintain correct seperation of concerns no styling is applied in either the ngChart html or javascript. All styling can be controlled using CSS.

For example, each bar/column element is given four classes (where [val] is autopopulated from the dataset)

`s_[val]`  the series index of the current element

`c_[val]`  the category value for the current element

`v_[val]`  the quantifiable value of the current element

`i_[val]`  the index of the current element

The above classes allow you to add styles for any combination of series, category, value and index.

###Todo###

Additional chart types: line, pie, scatter, bubble

Add legend, tooltips, hover values

Animation

Minus offsets, min max axis axis values configurable

Axis basing/scaling


