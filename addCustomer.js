module.exports = function(){
    var express = require('express');
    var router = express.Router();


    router.get('/', function(req, res){
        var callbackCount = 0;
        var mysql = req.app.get('mysql');

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
        var inserts = [req.body.customerName, req.body.customerEmail, req.body.customerPass, req.body.customerCredit, req.body.customerAddress,req.body.customerAptNum, req.body.customerPhone, req.body.customerBirthdate];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/register');
            }
        });
    });

    return router;
}();