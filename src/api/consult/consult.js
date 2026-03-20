import service from '../../utils/request';

export function newSession() {
    return service.post('contact/session/start');
}

export function getSessionList( params) {
    return service.get('contact/session/list', { params });
}

export function getSessionDetail(sessionId) {
    return service.get(`contact/session/detail`,{ params: { sessionId: sessionId } });
}

export function deleteSession(sessionId) {
    return service.post(`contact/session/delete`, { sessionId });
}
