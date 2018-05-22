/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Expressen' });
};

exports.user = function(req, res){
    res.render('index', { title: 'User' });
};