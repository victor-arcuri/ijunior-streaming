"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prismaClient_js_1 = require("../../../../config/prismaClient.js");
var bcrypt_1 = require("bcrypt");
var library_1 = require("@prisma/client/runtime/library");
var ServiceUsuario = /** @class */ (function () {
    function ServiceUsuario() {
    }
    // Cria novo usuário
    ServiceUsuario.prototype.criarUsuario = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var hashSenha, usuario, usuarioCriado, erro_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt_1.default.hash(body.senha, 10)];
                    case 1:
                        hashSenha = _a.sent();
                        usuario = {
                            nome: body.nome,
                            email: body.email,
                            senha: hashSenha,
                            privilegio: body.privilegio,
                            foto: body.foto,
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, prismaClient_js_1.default.usuario.create({ data: usuario })];
                    case 3:
                        usuarioCriado = _a.sent();
                        return [2 /*return*/, usuarioCriado];
                    case 4:
                        erro_1 = _a.sent();
                        if (erro_1 instanceof library_1.PrismaClientKnownRequestError) {
                            if (erro_1.code === 'P2002') {
                                throw new Error('Erro ao criar usuário: e-mail já está em uso');
                            }
                        }
                        throw new Error("Erro ao criar usu\u00E1rio: ".concat(erro_1));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Deleta usuário com id especifico
    ServiceUsuario.prototype.deletarUsuario = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var erro_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prismaClient_js_1.default.usuario.delete({
                                where: {
                                    id: id,
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        erro_2 = _a.sent();
                        throw new Error("Erro ao deletar usu\u00E1rio: ".concat(erro_2));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Lista todos os usuários registrados
    ServiceUsuario.prototype.listarUsuarios = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usuarios, erro_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prismaClient_js_1.default.usuario.findMany({
                                orderBy: {
                                    id: 'asc',
                                },
                                omit: {
                                    senha: true,
                                },
                            })];
                    case 1:
                        usuarios = _a.sent();
                        return [2 /*return*/, usuarios];
                    case 2:
                        erro_3 = _a.sent();
                        throw new Error("Erro ao listar usu\u00E1rios: ".concat(erro_3));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Retoma o usuário com id especificado
    ServiceUsuario.prototype.listarUsuarioID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var usuario, erro_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prismaClient_js_1.default.usuario.findUnique({
                                where: {
                                    id: id,
                                },
                                omit: {
                                    senha: true,
                                },
                            })];
                    case 1:
                        usuario = _a.sent();
                        return [2 /*return*/, usuario];
                    case 2:
                        erro_4 = _a.sent();
                        throw new Error("Erro ao retomar usu\u00E1rio de id ".concat(id, ": ").concat(erro_4));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Retoma o usuário com email especificado
    ServiceUsuario.prototype.listarUsuarioEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var usuario, erro_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prismaClient_js_1.default.usuario.findUnique({
                                where: {
                                    email: email,
                                },
                                omit: {
                                    senha: true,
                                },
                            })];
                    case 1:
                        usuario = _a.sent();
                        return [2 /*return*/, usuario];
                    case 2:
                        erro_5 = _a.sent();
                        throw new Error("Erro ao retomar usu\u00E1rio de email ".concat(email, ": ").concat(erro_5));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Atualiza informações do usuário de id especificado
    ServiceUsuario.prototype.atualizaUsuario = function (id, body) {
        return __awaiter(this, void 0, void 0, function () {
            var usuarioUpdate, _a, usuario, erro_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        usuarioUpdate = __assign({}, body);
                        if (!(typeof body.senha === 'string')) return [3 /*break*/, 2];
                        _a = usuarioUpdate;
                        return [4 /*yield*/, bcrypt_1.default.hash(body.senha, 10)];
                    case 1:
                        _a.senha = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, prismaClient_js_1.default.usuario.update({
                                where: {
                                    id: id,
                                },
                                data: usuarioUpdate,
                            })];
                    case 3:
                        usuario = _b.sent();
                        return [2 /*return*/, usuario];
                    case 4:
                        erro_6 = _b.sent();
                        throw new Error("Erro ao atualizar usu\u00E1rio de id ".concat(id, ": ").concat(erro_6));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ServiceUsuario.prototype.listaHistoricoUsuario = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var historico, erro_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prismaClient_js_1.default.logMusica.findMany({
                                where: {
                                    usuarioId: id,
                                },
                                orderBy: {
                                    tempo: 'desc',
                                },
                                select: {
                                    tempo: true,
                                    musica: { select: { nome: true } },
                                },
                            })];
                    case 1:
                        historico = _a.sent();
                        return [2 /*return*/, historico];
                    case 2:
                        erro_7 = _a.sent();
                        throw new Error("Erro ao listar hist\u00F3rico: ".concat(erro_7));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ServiceUsuario.prototype.listaMusicasSalvasUsuario = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var musicasSalvas, erro_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prismaClient_js_1.default.musicaSalva.findMany({
                                where: {
                                    usuarioId: id,
                                },
                                select: {
                                    musica: {
                                        select: {
                                            nome: true,
                                            autoria: {
                                                select: {
                                                    artista: {
                                                        select: {
                                                            nome: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                    case 1:
                        musicasSalvas = _a.sent();
                        return [2 /*return*/, musicasSalvas];
                    case 2:
                        erro_8 = _a.sent();
                        throw new Error("Erro ao listar m\u00FAsicas salvas: ".concat(erro_8));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ServiceUsuario;
}());
exports.default = new ServiceUsuario();
