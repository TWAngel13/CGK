module.exports = {
    InvalidParameters:{
        code: -1,
        statusCode: 405,
        error: "Incorrect parameters",
    },
    NotExists:{
        code: -2,
        statusCode:404,
        error: "Doesn't exists",
    },
    AlreadyExists:{
        code: -3,
        statusCode: 409,
        error: "Already exists"
    },
    AccessDenied:{
        code: -4,
        statusCode: 401,
        error: "Access denied"
    }
}