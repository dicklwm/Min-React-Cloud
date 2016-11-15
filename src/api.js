import request from 'superagent'

const host = 'http://101.200.129.112:9527/',
 GET_FILE = host + 'file/get/',
 RENAME_FILE = host + 'file/rename/',
 MKDIR = host + 'file/mkdir/',
 REMOVE = host + 'file/remove/',
 PASTE = host + 'file/copy',
 CUT = host + 'file/move';
export const UPLOAD_URL = host+'file/upload/';
export function getFileList(path,successCb,errorCb) {
    request
        .get(GET_FILE)
        .query({
            path:path
        })
        .end(function (err, res) {
            if(err){return errorCb(err)}
            successCb(res.body)
        })
}

export function rename(query,successCb,errorCb) {
    request
        .get(RENAME_FILE)
        .query(query)
        .end(function (err, res) {
            if(err){return errorCb(err)}
            successCb(res.body)
        })
}

export function mkdir(query,successCb,errorCb) {
    request
        .get(MKDIR)
        .query(query)
        .end(function (err, res) {
            if(err){return errorCb(err)}
            successCb(res.body)
        })
}
export function remove(query, successCb, errorCb) {
    request
        .get(REMOVE)
        .query(query)
        .end(function (err, res) {
            if(err){return errorCb(err)}
            successCb(res.body)
        })
}
export function paste(query, successCb, errorCb) {
    request
        .get(PASTE)
        .query(query)
        .end(function (err, res) {
            if(err){return errorCb(err)}
            successCb(res.body)
        })
}
export function cut(query, successCb, errorCb) {
    request
        .get(CUT)
        .query(query)
        .end(function (err, res) {
            if(err){return errorCb(err)}
            successCb(res.body)
        })
}