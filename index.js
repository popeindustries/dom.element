var classList = require('dom.classlist')
	, select = require('dom.select')
	, text = require('dom.text')
	, css = require('dom.style')
	, event = require('events.event')
	, identify = require('util.identify')
	, numberUtils = require('util.number')
	, animate = require('util.animate')
	, win = window
	, doc = win.document
	, elements = []
	, id = 0;

/**
 * Element instance factory
 * @param {DOMElement} domElement
 * @returns {Element}
 */
function elementFactory(domElement) {
	var el, item;
	// Retrieve from cache
	for (var i = 0, n = elements.length; i < n; i++) {
		item = elements[i];
		if (item.domElement === domElement) {
			return item;
		}
	}
	el = new Element(domElement);
	elements.push(el);
	return el;
};

/**
 * Create new Element instances based on 'selector'
 * @param {String} selector
 * @param {Object} context
 * @param {String} tag
 * @returns {Array}
 */
module.exports = function(selector, context, tag) {
	var element, results;
	if (context == null) context = doc;
	// Retrieve dom element(s) if passed a selector string
	if (identify.isString(selector)) {
		selector = select(selector, context, tag);
	// Error if not passed dom element or array
	} else if (!(identify.isElement(selector) || identify.isArray(selector))) {
		return null;
	}

	// Return array of Elements
	if (identify.isArray(selector)) {
		results = [];
		for (var i = 0, n = selector.length; i < n; i++) {
			element = selector[i];
			if (identify.isElement(element)) {
				results.push(elementFactory(element));
			}
		}
		return results;
	// Return a single Element if passed a DOM Element
	} else if (selector != null) {
		return elementFactory(selector);
	} else {
		return null;
	}
};

/**
 * Element class
 * @param {DOMElement} domElement
 */
function Element(domElement) {
	this.domElement = domElement;
	this.anim = null;
	this.id = this.domElement.id;
	this._id = id++;
	this.tagName = this.domElement.tagName;
}

/**
 * Retrieve width
 * @returns {Number}
 */
Element.prototype.getWidth = function() {
	return this.domElement.offsetWidth;
};

/**
 * Set width
 * @param {Number} value
 */
Element.prototype.setWidth = function(value) {
	if (value != null) {
		this.setStyle('width', value);
		if (this.domElement.width != null) {
			this.domElement.width = value;
		}
	}
	// Chain
	return this;
};

/**
 * Retrieve height
 * @returns {Number}
 */
Element.prototype.getHeight = function() {
	return this.domElement.offsetHeight;
};

/**
 * Set height
 * @param {Number} value
 */
Element.prototype.setHeight = function(value) {
	if (value != null) {
		this.setStyle('height', value);
		if (this.domElement.height != null) {
			this.domElement.height = value;
		}
	}
	return this;
};

/**
 * Retrieve opacity
 * @returns {Number}
 */
Element.prototype.getOpacity = function() {
	return this.getStyle('opacity');
};

/**
 * Set opacity
 * @param {Number} value
 */
Element.prototype.setOpacity = function(value) {
	if (value != null) {
		this.setStyle('opacity', numberUtils.limit(parseFloat(value), 0, 1));
	}
	return this;
};

/**
 * Retrieve offset from parent
 * @returns {Object}
 */
Element.prototype.getOffset = function() {
	return {
		top: this.domElement.offsetTop,
		left: this.domElement.offsetLeft
	};
};

/**
 * Retrieve global position
 * @returns {Object}
 */
Element.prototype.getPosition = function() {
	var top = this.domElement.offsetTop
		, left = this.domElement.offsetLeft
		, el;
	if ((el = this.domElement).offsetParent) {
		while ((el = el.offsetParent)) {
			top += el.offsetTop;
			left += el.offsetLeft;
		}
	}
	return {
		top: top,
		left: left
	};
};

/**
 * @see classList.hasClass
 */
Element.prototype.hasClass = function(clas) {
	return classList.hasClass(this.domElement, clas);
};

/**
 * @see classList.matchClass
 */
Element.prototype.matchClass = function(clas) {
	return classList.matchClass(this.domElement, clas);
};

/**
 * @see classList.addClass
 */
Element.prototype.addClass = function(clas) {
	classList.addClass(this.domElement, clas);
	return this;
};

/**
 * @see classList.removeClass
 */
Element.prototype.removeClass = function(clas) {
	classList.removeClass(this.domElement, clas);
	return this;
};

/**
 * @see classList.toggleClass
 */
Element.prototype.toggleClass = function(clas) {
	classList.toggleClass(this.domElement, clas);
	return this;
};

/**
 * @see classList.replaceClass
 */
Element.prototype.replaceClass = function(clasOld, clasNew) {
	classList.replaceClass(this.domElement, clasOld, clasNew);
	return this;
};

/**
 * @see classList.addTemporaryClass
 */
Element.prototype.addTemporaryClass = function(clas, duration) {
	classList.addTemporaryClass(this.domElement, clas, duration);
	return this;
};

/**
 * @see text.getText
 */
Element.prototype.getText = function() {
	return text.getText(this.domElement);
};

/**
 * @see text.setText
 */
Element.prototype.setText = function(value) {
	text.setText(this.domElement, value);
	return this;
};

/**
 * Retrieve innerHTML
 * @returns {String}
 */
Element.prototype.getHTML = function() {
	return this.domElement.innerHTML;
};

/**
 * Set innerHTML
 * @param {String} value
 */
Element.prototype.setHTML = function(value) {
	this.domElement.innerHTML = value;
	return this;
};

/**
 * @see css.getStyle
 */
Element.prototype.getStyle = function(property) {
	return css.getStyle(this.domElement, property);
};

/**
 * @see css.getNumericStyle
 */
Element.prototype.getNumericStyle = function(property) {
	return css.getNumericStyle(this.domElement, property);
};

/**
 * @see css.setStyle
 */
Element.prototype.setStyle = function(property, value) {
	css.setStyle(this.domElement, property, value);
	return this;
};

/**
 * @see css.clearStyle
 */
Element.prototype.clearStyle = function(property) {
	css.clearStyle(this.domElement, property);
	return this;
};

/**
 * @see event.on
 */
Element.prototype.on = function(type, callback, data) {
	event.on(this.domElement, type, callback, data);
	return this;
};

/**
 * @see event.off
 */
Element.prototype.off = function(type, callback) {
	event.off(this.domElement, type, callback);
	return this;
};

/**
 * @see event.one
 */
Element.prototype.one = function(type, callback, data) {
	event.one(this.domElement, type, callback, data);
	return this;
};

/**
 * @see animate
 */
Element.prototype.animate = function() {
	if (!this.anim) this.anim = animate(this.domElement, true);
	return this.anim
};

/**
 * Retrieve attribute
 * @param {String} type
 * @returns {String}
 */
Element.prototype.getAttribute = function(type) {
	return this.domElement.getAttribute(type);
};

/**
 * Set attribute
 * @param {String} or {Object} type
 * @param {String} value
 */
Element.prototype.setAttribute = function(type, value) {
	if(identify.isObject(type)){
		for(var key in type) {
    	this.domElement.setAttribute(key, type[key]);
  	}
	}else if(identify.isString(type)){
		this.domElement.setAttribute(type, value);
	}
	return this;
};

/**
 * Retrieve child elements matching 'selector'
 * @param {String} selector
 * @returns {Array}
 */
Element.prototype.find = function(selector) {
	return module.exports(selector, this);
};

/**
 * Retrieve parent element
 * @param {Boolean} asElement
 * @returns {DOMElement or Element}
 */
Element.prototype.parent = function(asElement) {
	if (asElement == null) asElement = true;
	return asElement ? new Element(this.domElement.parentNode) : this.domElement.parentNode;
};

/**
 * Retrieve children
 * @param {Boolean} asElement
 * @returns {Array}
 */
Element.prototype.children = function(asElement) {
	var nodes = this.domElement.childNodes
		, results = []
		, child;
	if (asElement == null) asElement = true;
	for (var i = 0, n = nodes.length; i < n; i++) {
		child = nodes[i];
		if (child && child.nodeType === 1) {
			results.push(asElement ? new Element(child) : child);
		}
	}
	return results;
};

/**
 * Retrieve first child
 * @param {Boolean} asElement
 * @returns {DOMElement or Element}
 */
Element.prototype.firstChild = function(asElement) {
	if (asElement == null) asElement = true;
	return asElement ? new Element(this.domElement.firstChild) : this.domElement.firstChild;
};

/**
 * Retrieve last child
 * @param {Boolean} asElement
 * @returns {DOMElement or Element}
 */
Element.prototype.lastChild = function(asElement) {
	if (asElement == null) asElement = true;
	return asElement ? new Element(this.domElement.lastChild) : this.domElement.lastChild;
};

/**
 * Append child
 * @param {DOMElement or Element} element
 */
Element.prototype.appendChild = function(element) {
	return this.domElement.appendChild(element.domElement || element);
};

/**
 * Remove child
 * @param {DOMElement or Element} element
 */
Element.prototype.removeChild = function(element) {
	return this.domElement.removeChild(element.domElement || element);
};

/**
 * Replace child
 * @param {DOMElement or Element} newElement
 * @param {DOMElement or Element} oldElement
 */
Element.prototype.replaceChild = function(newElement, oldElement) {
	this.domElement.replaceChild(newElement.domElement || newElement, oldElement.domElement || oldElement);
	return oldElement;
};

/**
 * Remove from parent
 */
Element.prototype.remove = function() {
	return this.parent().removeChild(this.domElement);
};

/**
 * Insert 'element' before 'referenceElement'
 * @param {DOMElement or Element} element
 * @param {DOMElement or Element} referenceElement
 */
Element.prototype.insertBefore = function(element, referenceElement) {
	return this.domElement.insertBefore(element.domElement || element, referenceElement.domElement || referenceElement);
};

/**
 * Clone element
 * @param {Boolean} deep
 * @param {Boolean} asElement
 */
Element.prototype.clone = function(deep, asElement) {
	if (asElement == null) asElement = true;
	return asElement ? new Element(this.domElement.clone(deep)) : this.domElement.clone(deep);
};

/**
 * Insert HTML before the element itself
 * @param {String} value
 */
Element.prototype.before = function(value) {
	return this.domElement.insertAdjacentHTML('beforebegin', value);
};

/**
 * Insert HTML after the element itself
 * @param {String} value
 */
Element.prototype.after = function(value) {
	return this.domElement.insertAdjacentHTML('afterend', value);
};

/**
 * Insert HTML just inside the element, before its first child
 * @param {String} value
 */
Element.prototype.prepend = function(value) {
	return this.domElement.insertAdjacentHTML('afterbegin', value);
};

/**
 * Insert HTML just inside the element, after its last child
 * @param {String} value
 */
Element.prototype.append = function(value) {
	return this.domElement.insertAdjacentHTML('beforeend', value);
};

/**
 * Wrap 'element'
 * @param {DOMElement or Element} element
 */
Element.prototype.wrap = function(element) {
  if (!element.length) element = [element];
  for (var i = element.length - 1; i >= 0; i--) {
    var child = (i > 0) ? this.domElement.cloneNode(true) : this.domElement;
    var el = element[i];
    var parent  = (el.domElement) ? el.domElement.parentNode : el.parentNode
    var sibling = (el.domElement) ? el.domElement.nextSibling : el.nextSibling

    child.appendChild(el.domElement || el);

    if(sibling) {
    	parent.insertBefore(child, sibling);
    }else{
    	parent.appendChild(child);
    }
  }
};

/**
 * Wrap all 'elements'
 * @param {DOMElement or Element} element
 */
Element.prototype.wrapAll = function(element) {
  var el = element.length ? element[0] : element;
  var parent  = (el.domElement) ? el.domElement.parentNode : el.parentNode
  var sibling = (el.domElement) ? el.domElement.nextSibling : el.nextSibling
  console.log(this)
  this.appendChild(el.domElement || el);

  while (element.length) {
  	this.domElement.appendChild(elms[0]);
  }

  if(sibling) {
  	parent.insertBefore(this.domElement, sibling);
  }else{
  	parent.appendChild(this.domElement);
  }
};

/**
 * Destroy element and optionally remove from parent
 * @param {Boolean} remove
 */
Element.prototype.destroy = function(remove) {
	if (remove == null) remove = false;
	event.offAll(this);
	// Setting keep to false will trigger destroy automatically
	if (this.anim != null) {
		if (this.anim.isRunning) {
			this.anim.keep = false;
		} else {
			this.anim.destroy();
		}
		this.anim = null;
	}
	if (remove) {
		this.domElement.parentNode.removeChild(this.domElement);
	}
	// Remove from DOM
	this.domElement = null;
	// Remove from cache
	for (var i = 0, n = elements.length; i < n; i++) {
		if (elements[idx] === this) {
			elements.splice(i, 1);
		}
		break;
	}
};
