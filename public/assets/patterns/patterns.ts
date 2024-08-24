export const Patterns = {
    NamePattern: /^(?!\W)(?!.*\W$)(?!.*?\W\W)[- +\w]{1,20}$/,
    PasswordPattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,128}$/,
    LinkPattern: /^$|^https:\/\//
}