module.exports = (req,res,next)=>{
    if(!req.session.isAuthenticated){
        return res.status(403).json({
                    err: true,
                    message: 'Немає доступу'
                })
    }
    next()
}