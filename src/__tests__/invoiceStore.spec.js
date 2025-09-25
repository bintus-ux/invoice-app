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
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var pinia_1 = require("pinia");
var invoiceStore_1 = require("@/stores/invoiceStore");
(0, vitest_1.describe)('invoiceStore', function () {
    var store;
    (0, vitest_1.beforeEach)(function () {
        (0, pinia_1.setActivePinia)((0, pinia_1.createPinia)());
        store = (0, invoiceStore_1.useInvoiceStore)();
        // disable async loadInvoices side effect
        store.loadInvoices = vitest_1.vi.fn();
        store.invoices = [];
    });
    var makeInvoice = function (overrides) {
        if (overrides === void 0) { overrides = {}; }
        return (__assign({ id: Date.now(), createdAt: new Date().toISOString(), number: 'INV-1', reference: 'REF-1', dueDate: '2025-10-01', amount: 100, status: 'DRAFT', clientName: 'Test Client', clientPhone: '123', clientEmail: 'test@example.com', issueDate: '2025-09-01', currency: 'USD', items: [] }, overrides));
    };
    (0, vitest_1.it)('starts with empty invoices and correct defaults', function () {
        (0, vitest_1.expect)(store.invoices).toEqual([]);
        (0, vitest_1.expect)(store.selectedInvoice).toBeNull();
        (0, vitest_1.expect)(store.isModalOpen).toEqual(false);
        (0, vitest_1.expect)(store.isLoading).toEqual(true);
    });
    (0, vitest_1.it)('setInvoices replaces invoice list', function () {
        var invoice = makeInvoice({ id: 1 });
        store.setInvoices([invoice]);
        (0, vitest_1.expect)(store.invoices).toHaveLength(1);
        (0, vitest_1.expect)(store.invoices[0].id).toEqual(1);
    });
    (0, vitest_1.it)('addInvoice creates and prepends new invoice', function () {
        var invoice = store.addInvoice({
            number: 'INV-2',
            reference: 'REF-2',
            dueDate: '2025-10-10',
            amount: 200,
            status: 'PAID',
            clientName: 'Client 2',
            clientPhone: '555',
            clientEmail: 'c2@example.com',
            issueDate: '2025-09-05',
            currency: 'USD',
            items: [],
        });
        (0, vitest_1.expect)(store.invoices[0]).toEqual(invoice);
        (0, vitest_1.expect)(invoice.id).toBeDefined();
        (0, vitest_1.expect)(invoice.createdAt).toBeDefined();
    });
    (0, vitest_1.it)('pushInvoice prepends an invoice', function () {
        var invoice = makeInvoice({ id: 2 });
        store.pushInvoice(invoice);
        (0, vitest_1.expect)(store.invoices[0]).toEqual(invoice);
    });
    (0, vitest_1.it)('recentInvoices returns 5 most recent sorted by createdAt', function () {
        var now = Date.now();
        for (var i = 0; i < 6; i++) {
            store.pushInvoice(makeInvoice({
                id: i,
                createdAt: new Date(now - i * 1000).toISOString(),
            }));
        }
        (0, vitest_1.expect)(store.recentInvoices).toHaveLength(5);
        var ids = store.recentInvoices.map(function (inv) { return inv.id; });
        // should be most recent 5 ids: 0..4
        (0, vitest_1.expect)(ids).not.toContain(5);
    });
    (0, vitest_1.it)('totalStats calculates correctly', function () {
        store.setInvoices([
            makeInvoice({ amount: 100, status: 'PAID' }),
            makeInvoice({ amount: 50, status: 'OVERDUE' }),
            makeInvoice({ amount: 30, status: 'DRAFT' }),
            makeInvoice({ amount: 20, status: 'SENT' }),
        ]);
        (0, vitest_1.expect)(store.totalStats.totalPaid).toEqual(100);
        (0, vitest_1.expect)(store.totalStats.totalOverdue).toEqual(50);
        (0, vitest_1.expect)(store.totalStats.totalDraft).toEqual(30);
        (0, vitest_1.expect)(store.totalStats.totalUnpaid).toEqual(20);
    });
    (0, vitest_1.it)('openInvoiceModal sets selectedInvoice and opens modal', function () {
        var invoice = makeInvoice({ id: 99 });
        store.openInvoiceModal(invoice);
        (0, vitest_1.expect)(store.selectedInvoice).toEqual(invoice);
        (0, vitest_1.expect)(store.isModalOpen).toEqual(true);
    });
    (0, vitest_1.it)('closeInvoiceModal clears selectedInvoice and closes modal', function () {
        var invoice = makeInvoice({ id: 101 });
        store.openInvoiceModal(invoice);
        store.closeInvoiceModal();
        (0, vitest_1.expect)(store.selectedInvoice).toBeNull();
        (0, vitest_1.expect)(store.isModalOpen).toEqual(false);
    });
    (0, vitest_1.it)('updateInvoiceStatus updates an invoice status', function () {
        var invoice = makeInvoice({ id: 202, status: 'DRAFT' });
        store.pushInvoice(invoice);
        store.updateInvoiceStatus(202, 'PAID');
        (0, vitest_1.expect)(store.invoices[0].status).toEqual('PAID');
    });
});
