var router = require('express').Router()
var appHandler = require('../core/appHandler')
var authHandler = require('../core/authHandler')

// Add express-rate-limit for bulk endpoints
var rateLimit = require('express-rate-limit');

// Rate limit for modifyproduct (limit each IP to 5 requests per minute)
var modifyProductLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many modify product requests, please try again later."
});

// Limit to 10 requests per minute for bulkproductslegacy
var bulkProductsLegacyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many requests, please try again later."
});

// Limit to 10 requests per minute for bulkproducts
var bulkProductsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many bulk products requests, please try again later."
});

// Rate limit for the usersearch GET route (e.g. 30 requests per minute)
var userSearchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: "Too many requests to /usersearch, please try again later."
});
// Rate limit for the calc GET route (e.g. 10 requests per minute)
var calcLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many requests to /calc, please try again later."
});

// Rate limit for the modifyproduct GET route (e.g. 10 requests per minute)
var modifyProductLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many requests to /modifyproduct, please try again later."
});

// Rate limit for the products GET route (e.g. 30 requests per minute)
var productsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: "Too many requests to /products, please try again later."
});

// Rate limit for the root GET route (e.g. 30 requests per minute)
var rootLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: "Too many requests to /, please try again later."
});

module.exports = function () {
    router.get('/', rootLimiter, authHandler.isAuthenticated, function (req, res) {
        res.redirect('/learn')
    })

    router.get('/usersearch', userSearchLimiter, authHandler.isAuthenticated, function (req, res) {
        res.render('app/usersearch', {
            output: null
        })
    })

    router.get('/ping', authHandler.isAuthenticated, function (req, res) {
        res.render('app/ping', {
            output: null
        })
    })

    router.get('/bulkproducts', bulkProductsLimiter, authHandler.isAuthenticated, function (req, res) {
        res.render('app/bulkproducts',{legacy:req.query.legacy})
    })

    router.get('/products', productsLimiter, authHandler.isAuthenticated, appHandler.listProducts)

    router.get('/modifyproduct', authHandler.isAuthenticated, modifyProductLimiter, appHandler.modifyProduct)

    router.get('/useredit', authHandler.isAuthenticated, appHandler.userEdit)

    router.get('/calc', calcLimiter, authHandler.isAuthenticated, function (req, res) {
        res.render('app/calc',{output:null})
    })

    router.get('/admin', authHandler.isAuthenticated, function (req, res) {
        res.render('app/admin', {
            admin: (req.user.role == 'admin')
        })
    })

    router.get('/admin/usersapi', authHandler.isAuthenticated, appHandler.listUsersAPI)

    router.get('/admin/users', authHandler.isAuthenticated, function(req, res){
        res.render('app/adminusers')
    })

    router.get('/redirect', appHandler.redirect)

    router.post('/usersearch', authHandler.isAuthenticated, appHandler.userSearch)

    router.post('/ping', authHandler.isAuthenticated, appHandler.ping)

    router.post('/products', authHandler.isAuthenticated, appHandler.productSearch)

    router.post('/modifyproduct', authHandler.isAuthenticated, modifyProductLimiter, appHandler.modifyProductSubmit)

    router.post('/useredit', authHandler.isAuthenticated, appHandler.userEditSubmit)

    router.post('/calc', authHandler.isAuthenticated, appHandler.calc)

    router.post('/bulkproducts', bulkProductsLimiter, authHandler.isAuthenticated, appHandler.bulkProducts);

    router.post('/bulkproductslegacy', authHandler.isAuthenticated, bulkProductsLegacyLimiter, appHandler.bulkProductsLegacy);

    return router
}
