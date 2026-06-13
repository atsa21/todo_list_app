export const Patterns = {
    NamePattern: /^(?!\W)(?!.*\W$)(?!.*?\W\W)[- +\w]{1,20}$/,
    PasswordPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{6,128}$/,
    LinkPattern: /^$|^https:\/\//
}