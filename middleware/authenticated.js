module.exports = (req,res,next)=>{
    res.locals.isAuth = req.session.isAuthenticated
    // res.locals.token = req.session.token
    next()
}