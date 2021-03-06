var express = require('express');
var router = express.Router();
var Queue = require('../models/queue');
var QueueItem = require('../models/queueItem');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect them to the login page
	res.redirect('/login');
}

module.exports = function(passport){

    router.get('/', function(req, res) {
        Queue.find({}, function(err, queue) {
            if ( err ) {
                console.err(err);
            }
            res.render('index', { title: 'Muu', queue: queue });
        })
    })

    router.get('/queue/:track/:name', function(req, res) {
        var track = req.params.track;
        var name = req.params.name;
        Queue.findOne({name: track}, function(err, queue) {
            var items = queue.items || []
            res.render('queue', { title: 'Kön', track: track, name: name, queue: items });
        })
    })

	/* GET login page. */
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/admin',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/admin',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Admin Page */
	router.get('/admin', isAuthenticated, function(req, res){
        Queue.find({}, function(err, queue) {
            if ( err ) {
                console.err(err);
            }
            res.render('admin', { title: 'Muu', queue: queue, user: req.user });
        })
    });
    
    router.get('/admin/queue/:track', isAuthenticated, function(req, res){
        var track = req.params.track;
        Queue.findOne({name: track}, function(err, queue) {
            var items = queue.items || []
            res.render('adminQueue', { title: 'Kön', track: track, queue: items });
        })
    });
    
    router.post('/admin/queue', isAuthenticated, function(req, res){
        var track = req.body.track;
        console.log("Adding queue for ", track)
        var queue = new Queue({name: track})
        queue.save(function(err) {
            if (err) {
                console.log("Kunde inte skapa spår " + track)
            } 
        });
        res.redirect('/admin');

	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}




