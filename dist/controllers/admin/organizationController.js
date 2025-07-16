"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllOrgs = exports.UpdateOrg = exports.FetchOrg = exports.CreateOrg = void 0;
const organizationService_1 = __importDefault(require("../../services/organizationService"));
const CustomError_1 = require("../../utils/CustomError");
/**
 * Controller for handling organization-related create request.
 * @param {Request} req - The request object containing organization data.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
const CreateOrg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organization = yield organizationService_1.default.create(req.body);
        res.status(201).json({
            status: "success",
            data: organization,
        });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.CreateOrg = CreateOrg;
const FetchOrg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organization = yield organizationService_1.default.fetchOne(req.params.id);
        res.status(200).json({
            status: "success",
            data: organization,
        });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchOrg = FetchOrg;
const UpdateOrg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organization = yield organizationService_1.default.update(req.params.id, req.body);
        res.status(200).json({
            status: "success",
            data: organization,
        });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.UpdateOrg = UpdateOrg;
const FetchAllOrgs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizations = yield organizationService_1.default.fetchAll();
        res.status(200).json({
            status: "success",
            data: organizations,
        });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchAllOrgs = FetchAllOrgs;
