module.exports = function(email, name, token){
    return {
        to: email,
        from: 'coax-bootcamp@gmail.com',
        subject: 'Новий акаунт',
        html: `
        <h5>Доброго дня ${name}!</h5>
        <p>Ви успіщно зареєструвались на сайті <a href="https://coax-bootcamp-butenko.herokuapp.com/">https://coax-bootcamp-butenko.herokuapp.com/</a></p>

        <p>Для підтвердження реєстрації перейдіть по <a href="https://coax-bootcamp-butenko.herokuapp.com/auth//register/${token}">посиланню</a></p>
        `
    }
}