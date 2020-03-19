function deletePerson(customerID){
    $.ajax({
        url: '/pos/' + customerID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};