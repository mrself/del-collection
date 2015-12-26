var Item = require('./Item');

function Collection() {

}
Collection.Item = Item;

$.extend(Collection.prototype, $.Del, {
	initCollection: function(options) {
		var self = this;

		this._dName = options.dName;
		this._Item = options.itemClass || Item;
		this._items = {};
		this._itemsEl = (options.$el || this.$el.find('.' + this._dName))
							.each(function() {
								self.push(this);
							});
	},

	make: function(el) {
		var item = this._Item.make(el, this._dName, this._Item);
		item.initItem();
		return item;
	},

	add: function(item) {
		this._items[item.getId()] = item;
	},

	push: function(el) {
		this.add(this.make(el));
	},

	get: function(id) {
		return this._items[id];
	},

	each: function(cb) {
		for (var item in this._items) {
			if (cb(this._items[item]) === false) break;
		}
	},

	length: function() {
		return Object.keys(this._items).length;
	},

	filter: function(cb) {
		var items = [];
		this.each(function(item) {
			if (cb(item) === true) items.push(item);
		});
		return items;
	},

	has: function(el) {
		var isJQuery = el instanceof $;
		return this.filter(function(item) {
			if (isJQuery) return !!item.$el.find(el).length;
			return $.contains(item.el, el);
		});
	},

	hasOne: function(el) {
		var items = this.has(el);
		if (items.length) return items[0];
		return null;
	}
});
Collection.make = function($el, dName, _class) {
	_class = _class || Collection;
	var collection = new _class();
	collection.$el = $el;
	collection.dName = dName;
	return collection;
};
Collection.extend = function(fn) {
	$.extend(fn.prototype, Collection.prototype);
	var key;
	for (key in Collection) {
		fn[key] = Collection[key];
	}
};
module.exports = Collection;
