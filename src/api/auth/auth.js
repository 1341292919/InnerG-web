import service from '../../utils/request';

export function login(data) {
    const formData = new FormData();
    formData.append('account', data.account);
    formData.append('password', data.password);
    return service.post('/user/login', formData);
}

export function getVerifyCode(email) {
    return service.post('/user/email/code', {
        email: email
    }, {});
}

export function register(data) {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('verify_code', data.verify_code);
    formData.append('password', data.password);
    return service.post('/user/register', formData);
}

export function logout() {
    return service.post('/user/logout');
}

export function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    return service.post('/user/avatar', formData);
}

export function getUserInfo() {
    return service.get('/user/info');
}

export function updateUserAccount(data) {
    return service.post('/user/update/account', data);
}