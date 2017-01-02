'use strict';

var express = require('express');
var router = express.Router();
var pg = require('pg');
var moment = require('moment');
var passport = require('passport');
var bStrategy = require('passport').Strategy;
var connectionString = process.env.DATABASE_URL || 'postgres://w_admin:11111@localhost:5432/voteapp';
//require('../config/passport')(passport);

router.get('/api/view_restaurants', (req, res) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select * from restaurant;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.get('/api/view_menu', (req, res) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select * from restaurant a, menu b, restaurant_menu ab where a.id = ab.restaurant_id and ab.menu_id=b.id and ab.on_date=CURRENT_DATE;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.get('/api/view_votes', (req, res) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select * from vote a, restaurant b where a.restaurant_id=b.id and a.on_date=CURRENT_DATE;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.get('/api/view_votes_per_day/:current_date', (req, res) => {
  const results = [];
  // Get a Postgres client from the connection pool
  var current_date = moment(req.params.current_date).format("DD/MM/YYYY");
  console.log(current_date);
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('select * from vote a, restaurant b where a.restaurant_id=b.id and a.on_date=$1',
    [current_date]);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/vote_restaurant', (req, res) => {
  const results = [];
  // Grab data from http request
  var restaurant_id = req.body.restaurant_id;
  var on_date       = moment(req.body.on_date).format("DD/MM/YYYY");
  var user_id       = req.body.user_id;
  // Get a Postgres client from the connection pool
  console.log("Body Data", restaurant_id, on_date, user_id);
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO vote(restaurant_id, on_date, user_id) values($1, $2, $3)',
    [restaurant_id, on_date, user_id]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM vote ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/add_restaurant', (req, res) => {
  const results = [];
  // Grab data from http request
  var name = req.body.name;
  var address       = req.body.address;
  var phone       = req.body.phone;
  var email         = req.body.email;
  // Get a Postgres client from the connection pool

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO restaurant(name, address, phone, email) values($1, $2, $3, $4)',
    [name, address, phone, email]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM restaurant ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/add_menu', (req, res) => {
  const results = [];
  // Grab data from http request
  var name = req.body.name;
  var ingredient       = req.body.ingredient;
  var on_date       = moment(req.body.on_date).format("DD/MM/YYYY");
  //var updated         = req.body.updated;
  // Get a Postgres client from the connection pool

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO menu(name, ingredient, on_date) values($1, $2, $3)',
    [name, JSON.stringify(ingredient), on_date]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM menu ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/add_restaurant_menu', (req, res) => {
  const results = [];
  // Grab data from http request
  var restaurant_id       = req.body.restaurant_id;
  var menu_id       = req.body.menu_id;
  var on_date         = moment(req.body.on_date).format("DD/MM/YYYY");
  // Get a Postgres client from the connection pool

  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO restaurant_menu(restaurant_id, menu_id, on_date) values($1, $2, $3)',
    [restaurant_id, menu_id, on_date]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM restaurant_menu ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
