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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInvoiceStore = void 0;
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var dummyInvoices_1 = require("@/composables/dummyInvoices");
exports.useInvoiceStore = (0, pinia_1.defineStore)('invoice', function () {
    var invoices = (0, vue_1.ref)([]);
    var selectedInvoice = (0, vue_1.ref)(null);
    var isModalOpen = (0, vue_1.ref)(false);
    var isLoading = (0, vue_1.ref)(false);
    var recentInvoices = (0, vue_1.computed)(function () {
        return __spreadArray([], invoices.value, true).sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })
            .slice(0, 5);
    });
    var totalStats = (0, vue_1.computed)(function () {
        return invoices.value.reduce(function (stats, invoice) {
            if (invoice.status === 'PAID')
                stats.totalPaid += invoice.amount;
            if (invoice.status === 'OVERDUE')
                stats.totalOverdue += invoice.amount;
            if (invoice.status === 'DRAFT')
                stats.totalDraft += invoice.amount;
            if (['SENT', 'VIEWED', 'PENDING'].includes(invoice.status))
                stats.totalUnpaid += invoice.amount;
            return stats;
        }, {
            totalPaid: 0,
            totalOverdue: 0,
            totalDraft: 0,
            totalUnpaid: 0,
        });
    });
    var loadInvoices = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isLoading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    _a.sent();
                    invoices.value = dummyInvoices_1.dummyInvoices;
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to load invoices:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    isLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var setInvoices = function (newInvoices) {
        invoices.value = newInvoices;
    };
    var addInvoice = function (newInvoice) {
        var invoice = __assign(__assign({}, newInvoice), { id: Date.now(), createdAt: new Date().toISOString() });
        invoices.value.unshift(invoice);
        return invoice;
    };
    var pushInvoice = function (invoice) {
        invoices.value.unshift(invoice);
    };
    var openInvoiceModal = function (invoice) {
        console.log('🔄 Opening modal for invoice:', invoice.id);
        selectedInvoice.value = invoice;
        isModalOpen.value = true;
        console.log('✅ Modal state updated - selectedInvoice:', selectedInvoice.value);
        console.log('✅ Modal state updated - isModalOpen:', isModalOpen.value);
    };
    var closeInvoiceModal = function () {
        selectedInvoice.value = null;
        isModalOpen.value = false;
    };
    var updateInvoiceStatus = function (invoiceId, status) {
        var invoice = invoices.value.find(function (inv) { return inv.id === invoiceId; });
        if (invoice) {
            invoice.status = status;
        }
    };
    loadInvoices();
    return {
        invoices: invoices,
        selectedInvoice: selectedInvoice,
        isModalOpen: isModalOpen,
        isLoading: isLoading,
        recentInvoices: recentInvoices,
        totalStats: totalStats,
        loadInvoices: loadInvoices,
        setInvoices: setInvoices,
        addInvoice: addInvoice,
        pushInvoice: pushInvoice,
        openInvoiceModal: openInvoiceModal,
        closeInvoiceModal: closeInvoiceModal,
        updateInvoiceStatus: updateInvoiceStatus,
    };
});
