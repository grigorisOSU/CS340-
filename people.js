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

    function getPerson(res, mysql, context, customerID, complete){

        var sql = "SELECT customerID, customerName, customerEmail, customerPass, customerCredit, customerAddress, customerAptNum, customerPhone, customerBirthdate FROM Customers WHERE customerID = ?";
        var inserts = [customerID];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }

            /* Find people whose fname starts with a given string in the req */
    function getPeopleWithNameLike(req, res, mysql, context, complete) {
                //sanitize the input as well as include the % character
                 var query = "SELECT Customers.customerID, customerName, customerEmail, customerPass, customerCredit, customerAddress, customerAptNum, customerPhone, customerBirthdate FROM Customers WHERE Customers.customerName LIKE " + mysql.pool.escape(req.params.s + '%');
                console.log(query)
          
                mysql.pool.query(query, function(error, results, fields){
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
        context.jsscripts = ["deleteperson.js", "searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeople(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('pos', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:customerID', function(req, res){
        callbackCount = 0;
       
        var context = {};
        context.jsscripts = ["updateperson.js", "searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.customerID, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-person', context);
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
                res.redirect('/pos');
            }
        });
    });


        /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
        router.get('/search/:s', function(req, res){
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteperson.js","searchpeople.js"];
            var mysql = req.app.get('mysql');
            getPeopleWithNameLike(req, res, mysql, context, complete);
            getPlanets(res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    res.render('pos', context);
                }
            }
        });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:customerID', function(req, res){
        
        var mysql = req.app.get('mysql');
        
        var sql = "UPDATE Customers SET customerName=?, customerEmail=?, customerPass=?, customerCredit=?, customerAddress=?, customerAptNum=?, customerPhone=?, customerBirthdate=? WHERE customerID=?";
        var inserts = [req.body.customerName, req.body.customerEmail, req.body.customerPass, req.body.customerCredit, req.body.customerAddress,req.body.customerAptNum, req.body.customerPhone, req.body.customerBirthdate, req.params.customerID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:customerID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customers WHERE customerID = ?";
        var inserts = [req.params.customerID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();