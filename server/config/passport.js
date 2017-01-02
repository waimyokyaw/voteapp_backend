'use strict';
// config/passport.js

// load all the things we need
var BasicStrategy = require('passport').Strategy;

var pg_sql = require('pg');
var dbconfig = require('../models/database');
var client = new pg_sql.Client(dbconfig.connectionString);
client.on('drain', client.end.bind(client));
client.connect();

var users = [];

//client.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        //console.log('Serialized User : ', user);
        users = JSON.stringify(user);
        done(null, users);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        //console.log('user id : ' + id);
        //console.log('Deserialize Users ', users);
        done(null,users);
        /*
         * connection.query("SELECT * FROM people WHERE id = ? ",[id], function(err, rows){
            console.log('Users ==>> ', rows);
            done(err, rows[0]);
        });
        */
    });

    passport.use(
        'basic',
        new BasicStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',//'username',
            passwordField: 'password'
        },
        function(req, email, password, done) { // callback with email and password from our form
            client.query("SELECT * FROM people WHERE email = ? and password=?",[email],[password], function(err, result){
                if (err)
                    return done(err);
                if (!result.rows.length) {
                    return done(null, false, { loginMessage: 'No user found.' }); // req.flash is the way to set flashdata using connect-flash
                }

                console.log('Password matched!!');
                // all is well, return successful user
                console.log(result.rows[0]);
                return done(null, result.rows[0]);
            });
        })
    );
};
