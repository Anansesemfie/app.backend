"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookStatus = exports.UsersTypes = void 0;
var UsersTypes;
(function (UsersTypes) {
    UsersTypes[UsersTypes["User"] = 0] = "User";
    UsersTypes[UsersTypes["associate"] = 1] = "associate";
    UsersTypes[UsersTypes["admin"] = 2] = "admin";
})(UsersTypes || (exports.UsersTypes = UsersTypes = {}));
var BookStatus;
(function (BookStatus) {
    BookStatus[BookStatus["Active"] = 0] = "Active";
    BookStatus[BookStatus["Inactive"] = 1] = "Inactive";
    BookStatus[BookStatus["Deleted"] = 2] = "Deleted";
    BookStatus[BookStatus["Restricted"] = 3] = "Restricted";
})(BookStatus || (exports.BookStatus = BookStatus = {}));
