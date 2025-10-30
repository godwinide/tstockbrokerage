module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'You are not authorized to access this page');
    return res.redirect('/login');
  },
  ensureAdmin: function (req, res, next) {
    console.log('ensureAdmin check:', {
      isAuthenticated: req.isAuthenticated(),
      user: req.user ? { email: req.user.email, isAdmin: req.user.isAdmin } : null
    });
    
    if (req.isAuthenticated()) {
      if (req.user && req.user.isAdmin === true) {
        return next();
      }
      console.log('User is authenticated but not admin');
      req.flash('error_msg', 'Access denied. Admin privileges required.');
      return res.redirect('/admin/signin');
    }
    console.log('User is not authenticated');
    req.flash('error_msg', 'Please login to access this page');
    return res.redirect('/admin/signin');
  }
};