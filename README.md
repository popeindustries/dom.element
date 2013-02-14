An abstract DOM element object.

## Usage
```javascript
var element = require('dom.element');

var myEl = element('#elId');
myEl.setWidth(50);
var offset = myEl.getOffset();
myEl.toggleClass('hey');
myEl.setText('ho');
myEl.setStyle('background-color', 'rgb(0,0,0)');
var children = myEl.children(true);
myEl.animate().to({top:'50px'}, 0.5, 'quadOut').onComplete(function() {
	// Do on complete...
});
```