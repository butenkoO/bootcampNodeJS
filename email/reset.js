module.exports = function(email, token){
    return {
        to: email,
        from: 'coax-bootcamp@gmail.com',
        subject: 'Відновлення паролю',
        html: `
        <h3>Відновлення паролю<h3>
        <p>Для відновлення паролю перейдіть по посиланню</p>
        <a href="https://coax-bootcamp-butenko.herokuapp.com/auth/password/${token}">Відновити пароль</a>
        `
    }
}