var store_events = (function(){

	var items = document.getElementsByClassName('inventory_item'),
		list = document.getElementById('purchase_list'),
		falsePurchase = document.getElementById('false_purchase'),
		creds_container = document.getElementById('card_creds'),
		purchaseForm = document.getElementById('purchaseForm'),
		receipt = document.getElementById('receipt'),
		doneBtn = document.getElementById('done');

	var productIDMap = {
		"ass_cheese" : "Assorted Cheese",
		"che_cheese" : "Chedder Cheese",
		"fet_cheese" : "Feta Cheese",
		"blu_cheese" : "Blue Cheese",
		"cam_cheese" : "Camembert",
		"bri_cheese" : "Brie",
		"nor_cheese" : "Goat's Cheese",
		"moz_cheese" : "Mozzarella"
	};

	function createListItem(name, price, uid){

		var frag = document.createDocumentFragment(),
			li = document.createElement('li'),
			a = document.createElement('a'),
			item_price = document.createElement('a'),
			remove = document.createElement('span');

		li.setAttribute('data-price', price);
		li.setAttribute('data-product-id', uid);
		a.textContent = name;
		item_price.textContent = "@ £" + (price / 100).toFixed(2);
		item_price.setAttribute('class', "item_price");
		remove.setAttribute('class', 'remove');

		remove.addEventListener('click', function(){

			li.parentNode.removeChild(li);
			updateOrder();

		}, false);

		li.appendChild(a);
		li.appendChild(item_price);
		li.appendChild(remove);
		frag.appendChild(li);
		
		return frag;

	}

	function updateOrder(){

		var basket = list.getElementsByTagName('li'),
			amount = 0;

		for(var y = 0; y < basket.length; y += 1){

			amount += parseInt(basket[y].getAttribute('data-price'));

		}

		document.getElementById('total_value').textContent = "£" + (amount / 100).toFixed(2);

	}

	function hideAndResetForm(){

		creds_container.setAttribute('data-display', 'false');
		purchaseForm.reset();

	}

	function displayReceipt(thingsBought){

		var list = document.getElementById('tally'),
			itemFrag = document.createDocumentFragment();

		list.innerHTML = "";

		for(var g = 0; g < thingsBought.length; g += 1){

			var thisItem = document.createElement('li');
			thisItem.textContent = thingsBought[g].amount + "x " + productIDMap[thingsBought[g].productID];

			itemFrag.appendChild(thisItem);

		}

		list.appendChild(itemFrag);
		receipt.setAttribute('data-display', 'true');

	}

	for(var x = 0; x < items.length; x += 1){

		(function(item){

			item.getElementsByClassName('add')[0].addEventListener('click', function(){
				console.log(item);
				list.appendChild( createListItem( item.getAttribute('data-name'), item.getAttribute('data-price'), item.getAttribute('data-product-id') ) );
				updateOrder();

			}, false);

		})(items[x]);

	}

	falsePurchase.addEventListener('click', function(e){
		e.preventDefault();
		creds_container.setAttribute('data-display', 'true');
	}, false);

	purchaseForm.addEventListener('submit', function(e){
		e.preventDefault();
	});

	if(creds_container !== null){

		creds_container.addEventListener('click', function(e){

			if(e.target === creds_container){
				creds_container.setAttribute('data-display', 'false');
				purchaseForm.reset();
			}

		}, false);
			
	}

	doneBtn.addEventListener('click', function(){

		receipt.setAttribute('data-display', "false");
		purchaseForm.reset();
		purchase_list.innerHTML = "";
		updateOrder();

	});

	return {
		closeForm : hideAndResetForm,
		showReceipt : displayReceipt
	};

});