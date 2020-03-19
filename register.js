module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPeople(res, mysql, context, complete){
        mysql.pool.query("SELECT Customers.customerID, customerName, customerEmail, customerPass, customerCredit, customerAddress, customerAptNum, customerPhone, customerBirthdate FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        getPeople(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('register', context);
            }

        }
    });

    router.get('/register', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        getPeople(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('register', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customers (customerName, customerEmail, customerPass, customerCredit, customerAddress, customerAptNum, customerPhone, customerBirthdate) VALUES (?,?,?,?,?,?,?,?)";
        var inserts = [req.body.customerName, req.body.customerEmail, req.body.customerPass, req.body.customerCredit, req.body.customerAddress, req.body.customerAptNum, req.body.customerPhone, req.body.customerBirthdate];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/register');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */



    return router;
}();
