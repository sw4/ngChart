ngChart
==========

Pure Angular SVG Charting

Not production-ready. This library is in its infancy.

**Licensed under [cc by-sa 3.0](http://creativecommons.org/licenses/by-sa/3.0/) with attribution required**

**Work in progress - very rough code**


###About###

The purpose of this project is to implement SVG based charting using native angular techniques and no reliance on external libraries (jQuery, d3 etc).

Check the examples folder for current examples. 

###Usage###

Include the `ngChart.js` and `ngChart.css` files, to use:

```
<ng-chart ng-controller='yourController' data='data' x='category' y='y' margin="40"></ng-chart>  
```

Where `ng-controller` is the name of the controller to use to source chart data, a controller can be applied to the directive element directly, or to a parent.


#####Attributes#####

`data` (string) the source of data in `$scope`

`x` (string) the source of data for the X Axis on the specified `data` object array

`y` (string) the source of data for the Y Axis on the specified `data` object array

`margin` (number) chart margins

`type` (string) the chart type (currently only supports bar/column)

###Todo###

Support multiple data series

Additional chart types: bar, line, pie, scatter, bubble

Add legend, tooltips, hover values
