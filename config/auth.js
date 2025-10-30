module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'You are not authorized to access this page');
    return res.redirect('/login');
  },
  ensureAdmin: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      req.flash('error_msg', 'You are not authorized to access this page');
      return res.redirect('/admin/signin');
    }
    req.flash('error_msg', 'You are not authorized to access this page');
    return res.redirect('/admin/signin');
  }
};