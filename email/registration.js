module.exports = function(email, name){
    return {
        to: email,
        from: 'coax-bootcamp@gmail.com',
        subject: 'Новий акаунт',
        html: `
        <h5>Доброго дня ${name}!</h5>
        <p>Ви успіщно зареєструвались на сайті <a href="http://127.0.0.1:3000/">http://127.0.0.1:3000/</a> </p>
        `
    }
}