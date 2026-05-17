/**
 * @typedef {Object} LoginParams
 * @property {string} account
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterParams
 * @property {string} email
 * @property {string} verify_code
 * @property {string} password
 */

/**
 * @typedef {Object} EmailLoginParams
 * @property {string} email
 * @property {string} verify_code
 */

/**
 * @typedef {Object} PageParams
 * @property {number} [pageNum=1]
 * @property {number} [pageSize=10]
 */

/**
 * @typedef {Object} ArticlePageParams
 * @property {number} [pageNum]
 * @property {number} [pageSize]
 * @property {string} [title]
 * @property {number} [categoryId]
 * @property {number} [status]
 */

/**
 * @typedef {Object} MoodLogPageParams
 * @property {number} [pageNum]
 * @property {number} [pageSize]
 * @property {string} [userId]
 * @property {string} [moodScoreRange]
 */

/**
 * @typedef {Object} UpdateAccountParams
 * @property {string} account
 */

/**
 * @typedef {Object} UpdateUserNameParams
 * @property {string} username
 */

/**
 * @typedef {Object} UpdateGenderParams
 * @property {number} gender
 */

/**
 * @typedef {Object} ChangeStatusParams
 * @property {number} status
 */

/**
 * @typedef {Object} UploadFileBusinessInfo
 * @property {string|number} businessId
 */

/**
 * @typedef {Object} DeleteSessionParams
 * @property {string} sessionId
 */
