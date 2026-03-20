import service from '../../utils/request';

export function moodLogPage(params) {
    return service.get('/emotion-diary/admin/page', { params });
}