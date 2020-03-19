function updatePerson(customerID){
    $.ajax({ 
        url: '/pos/' + customerID,
        type: 'PUT',
        data: $('#update-person').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};