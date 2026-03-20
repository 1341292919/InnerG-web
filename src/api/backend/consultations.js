import service from '../../utils/request';

export function consultationPage(params) {
    return service.get('/psychological-chat/sessions', { params });
}

export function getSessionDetail(sessionId) {
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
}