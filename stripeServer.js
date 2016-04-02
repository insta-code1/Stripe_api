var express = require('express'),
	app = express(),
	http = require('http'),
	fs = require('fs'),
	querystring = require('querystring'),
	request = require('request'),
	bodyParser = require('body-parser'),
	stripe = require("stripe")("sk_test_DQoXZGF4xpTMIFNzJFuUIPc4");
	port = 8118;

for(var _ = 0; _ < process.argv.length; _ += 1){

	if(process.argv[_] === "--port" || process.argv[_] === "-port" || process.argv[_] === "-p"){

		if(process.argv[ _ + 1 ] !== undefined){
			port  = process.argv[_ + 1];
			break;
		}

	}

}

app.listen(port);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  next();
 });

console.log("Server started.\nAvailable on localhost:" + port);

function sortOrder(items){

	var itemised = [];

	for(var d = 0; d < items.length; d += 1){

		var itemExists = false,
			idx = 0;

		for(var e = 0; e < itemised.length; e += 1){
			if(itemised[e].productID === items[d].productID){
				itemExists = true;
				idx = e;
			}

		}

		if(itemExists){
			itemised[idx].amount += 1;
		} else {
			itemised.push({
				productID : items[d].productID,
				amount : 1
			});
		}

	}

	return itemised;

}

app.post("/order", function(req, res){

	var card_token = req.body.stripe_token,
		order = req.body.order,
		price = parseInt(req.body.order.total);

	var itemisedItems = sortOrder(order.items);

	stripe.charges.create({
		amount: price,
		currency: "gbp",
		source: card_token,
		description: "Customer cheese order"
		}, function(err, charge) {
			if (err && err.type === 'StripeCardError') {
				console.log(err);
				res.set(500);
				res.json({
					status : "ERR",
					message : "Something has gone horribly wrong"
				});
			} else {

				console.log(charge);
				res.json({
					status : "OK",
					thingsBought : itemisedItems
				});

			}
		});
});