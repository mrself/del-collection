var Item = require('./Item');

function Collection() {

}
Collection.Item = Item;

$.extend(Collection.prototype, {
	initCollection: function(options) {
		var self = this;

		this._itemDName = options.dName;
		this._Item = options.itemClass || Item;
		this._items = {};
		this._itemsEl = options.$el || this.$el.find('.' + this._itemDName);
		this._itemsEl.each(function() {
			self.push(this);
		});
	},

	getEls: function(index) {
		return this._itemsEl.eq(index);
	},

	getEl: function(index) {
		return this._itemsEl.eq(index);
	},

	make: function(el) {
		var item = this._Item.make(el, this._itemDName, this._Item);
		item.initItem();
		return item;
	},

	push: function(el) {
		var item = this.make(el);
		this.add(item);
		return item;
	},

	add: function(item) {
		this._itemsEl = this._itemsEl.add(item.$el);
		this._items[item.getId()] = item;
	},

	pushHtml: function(html) {
		var item = this._Item.makeFromHtml(html, this._itemDName, this._Item);
		this.add(item);
		return item;
	},

	get: function(id) {
		return this._items[id];
	},

	getByIndex: function(index) {
		return this._items[Object.keys(this._items)[index]];
	},

	getByEl: function(el) {
		var items = this.filter(function(item) {
			return item.el === el;
		});
		if (items.length) return items[0];
		return null;
	},

	each: function(cb) {
		for (var item in this._items) {
			if (!this._items[item]) continue;
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

	find: function(el) {
		var isJQuery = el instanceof $;
		return this.filter(function(item) {
			if (isJQuery) return !!item.$el.find(el).length;
			return $.contains(item.el, el);
		});
	},

	remove: function(item) {
		this._items[item.getId()] = undefined;
		this._itemsEl = this._itemsEl.not(item.el);
		item.$el.remove();
	},

	findOne: function(el) {
		var items = this.find(el);
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
