function getEl () {
	var $el = $('<div />', {
		"class": 'collection'
	});
	for (var i = 0; i < 10; i++) {
		$el.append($('<div />', {
			"class": 'collection__i'
		}));
	}
	return $el.clone();
}
window.l = function(x) {
	console.log(x);
};
var assert = chai.assert;
var MyCollection = function(){};
var MyItem = function(){
	this.prop = 1;
};
Collection.Item.extend(MyItem);
MyItem.prototype.test = 'test';
Collection.extend(MyCollection);

function getCollection () {
	var $el = getEl();
	var collection = MyCollection.make($el, 'collection');
	collection.initCollection({
		dName: 'collection__i',
		itemClass: MyItem
	});
	return collection;
}

describe('Collection', function() {
	it('extend', function() {
		assert(typeof MyCollection.make == 'function');
		assert(typeof MyCollection.extend == 'function');
		assert(typeof MyCollection.prototype.find == 'function');
	});

	it('init', function() {
		getCollection();
	});

	it('length', function() {
		var collection = getCollection();
		assert(collection.length() == 10);
	});

	it('collection items should be instance of MyItem', function() {
		var collection = getCollection();
		collection.each(function(item) {
			assert(item instanceof MyItem);
		});
	});

	it('filter', function() {
		var collection = getCollection();
		var $el = collection._itemsEl.eq(4);
		$el.addClass('markClass');
		var items = collection.filter(function(item) {
			return item.$el.hasClass('markClass');
		});
		assert(items.length === 1 && items[0].$el[0] === $el[0]);
	});

	it('find', function() {
		var collection = getCollection();
		var $el = collection._itemsEl.eq(4);
		var $subEl = $('<div />', {
			"class": 'subEl'
		});
		$el.append($subEl);
		var items = collection.find($subEl);
		assert(items.length === 1 && items[0].$el[0] === $el[0]);
	});

	it('findOne', function() {
		var collection = getCollection();
		var $el = collection._itemsEl.eq(4);
		var $subEl = $('<div />', {
			"class": 'subEl'
		});
		$el.append($subEl);
		var item = collection.findOne($subEl[0]);
		assert(item.$el[0] === $el[0]);
	});

	it('get', function() {
		var collection = getCollection();
		var $el = collection._itemsEl.eq(5);
		var id = $el.attr('id');
		assert(collection.get(id).$el[0] == $el[0]);
	});
});

function getItem () {
	var $el = $('<div />', {
		"class": 'collection__i'
	});
	var item = MyItem.make($el[0], 'collection__i', MyItem);
	return item;
}
function getItemClass () {
	return MyItem;
}
describe('Item', function() {
	describe('#getId', function() {
		it('if id is set', function() {
			var item = new MyItem();
			var $el = $('<div />', {
				"class": 'collection__i',
				id: 'myId'
			});
			item.el = $el[0];
			assert(item.getId() == 'myId');
		});
		it('if id is not set', function() {
			var item = new MyItem();
			Collection.Item._resetCounter();
			var $el = $('<div />', {
				"class": 'collection__i'
			});
			item.el = $el[0];
			item.dName = 'collection__i';
			assert(item.getId() == 'collection__i-0');
		});
	});


	it('make', function() {
		var item = getItem();
		assert(item.$el.length);
	});

	it('makeFromHtml', function() {
		var Item = getItemClass();
		var item = Item.makeFromHtml('<div class="item"></div>', 'item', Item);
		assert(item.$el.hasClass('item'));
	});
});