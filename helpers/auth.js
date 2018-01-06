module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('errorMsg', 'Not Authorized');
        res.redirect('/users/login');
    }
};