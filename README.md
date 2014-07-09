ngChart
==========

Pure Angular SVG Charting

Not production-ready. This library is in its infancy.

**Licensed under [cc by-sa 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with attribution required**

**Work in progress - very rough code**


###About###

The purpose of this project is to implement SVG based charting using native angular techniques and no reliance on external libraries (jQuery, d3 etc).

Check the examples folder for current examples. 

###Key Development Tenets###

Only use Angular or Vanilla Javascript

Maintain seperation of concerns - all styling kept to CSS, content HTML, functionality JS

Adhere to Angular design principles

Adhere to JS best practice

Charts should be declarative

###Usage###

Include the `ngChart.js` and `ngChart.css` files, to use:

```
<ng-chart ng-controller='yourController' data='data' x='category' y='y' margin="40"></ng-chart>  
```

Where `ng-controller` is the name of the controller to use to source chart data, a controller can be applied to the directive (`<ng-chart />`) element itself, or to its parent.


#####Attributes#####

`data` (string) the source of data in `$scope`

`x` (string) the source of data for the X Axis on the specified `data` object array

`y` (string) the source of data for the Y Axis on the specified `data` object array

`margin` (number/csv) chart margins either single integer or comma seperated values (top,right,bottom,left)

`type` (string) the chart type (currently only supports bar/column)

`title` (string) the chart title

`resize` (bool) whether to resize the chart if the parent container changes size

###Todo###

Support multiple data series

Additional chart types: line, pie, scatter, bubble

Add legend, tooltips, hover values

Animation

