export const admin = ({ session: { data: user } }) =>
    Boolean(user && user.role == 'admin')

export const editor = ({ session: { data: user } }) =>
    Boolean(user && user.role == 'editor')

export const apiGateway = ({ session: { data: user } }) =>
    Boolean(user && user.role == 'apiGateway')

export const allowRoles = (...args) => {
    return (auth) => {
        return args.reduce((result, check) => result || check(auth), false)
    }
}
