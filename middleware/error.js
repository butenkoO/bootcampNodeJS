module.exports = (req,res,next)=>{
    res.status(404).render('404',{
        title:'Сторінка не знайдена'
    })
}