"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridFSBucket = exports.initGridFS = void 0;
// server/config/gridfs.ts
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
let gridFSBucket = null;
const initGridFS = () => {
    if (!mongoose_1.default.connection.db) {
        throw new Error('Database connection not established');
    }
    gridFSBucket = new mongodb_1.GridFSBucket(mongoose_1.default.connection.db, {
        bucketName: 'uploads'
    });
    return gridFSBucket;
};
exports.initGridFS = initGridFS;
const getGridFSBucket = () => {
    if (!gridFSBucket) {
        return (0, exports.initGridFS)();
    }
    return gridFSBucket;
};
exports.getGridFSBucket = getGridFSBucket;
//# sourceMappingURL=gridfs.js.map