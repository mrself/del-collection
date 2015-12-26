function Item() {
	
}

var GuIdCounter = 0;
$.extend(Item.prototype, $.Del, {
	initItem: function() {
		// this.initDel();
	},

	getId: function() {
		return this.el.id || (this.el.id = this.makeId());
	},

	makeId: function() {
		return this.dName + '-' + GuIdCounter++;
	},
	
});


Item.make = function(el, dName, _class) {
	_class = _class || Item;
	var item = new _class();
	item.el = el;
	item.$el = $(el);
	item.dName = dName;
	return item;
};
Item.makeFromHtml = function(html, dName, _class) {
	_class = _class || Item;
	var item = new _class();
	item.$el = $(html);
	item.el = item.$el[0];
	item.$el.addClass(dName);
	item.dName = dName;
	return item;
};
Item._name = 'i';
Item.getName = function() {
	return Item._name;
};
Item._resetCounter = function() {
	GuIdCounter = 0;
};
Item.extend = function(fn) {
	$.extend(fn.prototype, Item.prototype);
	var key;
	for (key in Item) {
		fn[key] = Item[key];
	}
};

module.exports = Item;