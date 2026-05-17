/**
 * @typedef {Object} ApiResponse
 * @property {string} code
 * @property {string} message
 */

/**
 * @typedef {Object} EmptyResponse
 * @property {string} code
 * @property {string} message
 */

/**
 * @typedef {Object} UserInfoData
 * @property {string} Id
 * @property {string} Email
 * @property {string} UserName
 * @property {string} Account
 * @property {string} Avatar
 * @property {number} Gender
 * @property {number} RoleType
 * @property {number} CreatedAt
 * @property {number} UpdatedAT
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} code
 * @property {string} message
 * @property {UserInfoData} data
 */

/**
 * @typedef {Object} AvatarResponse
 * @property {string} code
 * @property {string} message
 * @property {{ AvatarUrl: string }} data
 */

/**
 * @typedef {Object} LoginHeaders
 * @property {string} [access-token]
 * @property {string} [refresh-token]
 */

/**
 * @typedef {Object} NewSessionData
 * @property {string} SessionId
 */

/**
 * @typedef {Object} NewSessionResponse
 * @property {string} code
 * @property {string} message
 * @property {NewSessionData} data
 */

/**
 * @typedef {Object} SessionItem
 * @property {string} UserId
 * @property {string} SessionId
 * @property {string} Title
 * @property {number} UpdatedAt
 * @property {number} CreatedAt
 * @property {number} MessageNum
 * @property {string} LastMessage
 * @property {string} LastSpeakRole
 * @property {string} Status
 */

/**
 * @typedef {Object} SessionMessage
 * @property {string} Role
 * @property {string} Content
 * @property {number} CreatedAt
 */

/**
 * @typedef {Object} SessionDetailObject
 * @property {string} UserId
 * @property {string} SessionId
 * @property {string} Title
 * @property {SessionMessage[]} Messages
 * @property {number} MessageNum
 * @property {string} Status
 * @property {number} UpdatedAt
 * @property {number} CreatedAt
 */

/**
 * @typedef {Object} SessionListData
 * @property {number} Total
 * @property {SessionItem[]} SessionList
 */

/**
 * @typedef {Object} SessionDetailData
 * @property {SessionDetailObject} SessionDetail
 */

/**
 * @typedef {Object} PlaylistItem
 * @property {string} Id
 * @property {string} Name
 * @property {string} Description
 * @property {string} CoverUrl
 * @property {number} Status
 * @property {number} PlayCount
 * @property {number} SongCount
 * @property {string} Tags
 * @property {number} CreatedAt
 * @property {number} UpdatedAt
 */

/**
 * @typedef {Object} SongBrief
 * @property {string} Id
 * @property {string} Name
 * @property {string} SingerName
 * @property {string} Album
 * @property {number} CreatedAt
 */

/**
 * @typedef {Object} SongDetailObject
 * @property {string} Id
 * @property {string} Name
 * @property {string} Description
 * @property {string} CoverUrl
 * @property {number} Status
 * @property {string} SingerName
 * @property {string} Album
 * @property {string} SourceUrl
 * @property {number} Duration
 * @property {number} PlayCount
 * @property {string} Tags
 * @property {number} CreatedAt
 * @property {number} UpdatedAt
 */

/**
 * @typedef {Object} PlaylistDetailObject
 * @property {string} Id
 * @property {string} Name
 * @property {string} Description
 * @property {string} CoverUrl
 * @property {number} Status
 * @property {number} PlayCount
 * @property {number} SongCount
 * @property {string} Tags
 * @property {SongBrief[]} Songs
 * @property {number} CreatedAt
 * @property {number} UpdatedAt
 */

/**
 * @typedef {Object} PlaylistListData
 * @property {number} Total
 * @property {PlaylistItem[]} PlaylistList
 */

/**
 * @typedef {Object} SongListData
 * @property {number} Total
 * @property {SongDetailObject[]} SongList
 */

/**
 * @typedef {Object} PlaylistDetailData
 * @property {PlaylistDetailObject} PlaylistDetail
 */

/**
 * @typedef {Object} SongDetailData
 * @property {SongDetailObject} SongDetail
 */

/**
 * @typedef {Object} CategoryTreeNode
 * @property {number} id
 * @property {string} name
 * @property {CategoryTreeNode[]} [children]
 */

/**
 * @typedef {Object} PageData
 * @property {number} Total
 * @property {Array} Records
 */
