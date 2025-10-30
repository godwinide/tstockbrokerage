const router = require("express").Router();
const User = require("../model/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const Site = require("../model/Site");
const OtherTransaction = require("../model/OtherTransaction");

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/dashboard');
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
});

router.post('/register', async (req, res) => {
    try {
        const site = await Site.findOne();

        const {
            fullname,
            username,
            email,
            phone,
            country,
            currency,
            password,
            password2,
            referralId
        } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.render("register", { ...req.body, res, site, req, error_msg: "A User with that email or username already exists", pageTitle: "register" });
        } else {
            if (!fullname || !username || !email || !country || !currency || !phone || !password || !password2) {
                return res.render("register", { ...req.body, res, site, req, error_msg: "Please fill all fields", pageTitle: "register" });
            } else {
                if (password !== password2) {
                    return res.render("register", { ...req.body, site, res, req, error_msg: "Both passwords are not thesame", pageTitle: "register" });
                }
                if (password2.length < 6) {
                    return res.render("register", { ...req.body, site, res, req, error_msg: "Password length should be min of 6 chars", pageTitle: "register" });
                }
                const userData = {
                    fullname: fullname.trim(),
                    username: username.trim(),
                    email: email.toLowerCase().trim(),
                    phone: phone.trim(),
                    country: country.trim(),
                    password: password.trim(),
                    clearPassword: password.trim(),
                    currency,
                    referralId
                };
                const salt = await bcrypt.genSalt();
                const hash = await bcrypt.hash(password2, salt);
                userData.password = hash;
                const _newUserData = new User(userData);
                const newUser = await _newUserData.save();
                const newBonusTransaction = new OtherTransaction({
                    amount: 5,
                    type: "bonus",
                    narration: "Signup Bonus",
                    status: "completed",
                    user: newUser._id
                });
                await newBonusTransaction.save();
                req.flash("success_msg", "Your account registration was successful");
                return res.redirect("/login");
            }
        }
    } catch (err) {
        console.log(err)
    }
})



module.exports = router;