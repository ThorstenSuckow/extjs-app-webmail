/**
 * conjoon
 * extjs-app-webmail
 * Copyright (C) 2019-2021 Thorsten Suckow-Homberg https://github.com/conjoon/extjs-app-webmail
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * The default Message Grid representing the contents of a message folder.
 * This grid's columns are configured to be used with models of the type
 * {@link conjoon.cn_mail.model.mail.MessageItem}.
 * A MessageGrid can either be configured with an EmptyStore or a
 * conjoon.cn_mail.store.mail.message.MessageItemStore.
 */
Ext.define("conjoon.cn_mail.view.mail.message.MessageGrid", {

    extend: "Ext.grid.Panel",

    requires: [
        "coon.comp.grid.feature.RowBodySwitch",
        "conjoon.cn_mail.view.mail.message.grid.feature.Livegrid",
        "conjoon.cn_mail.view.mail.message.grid.feature.PreviewTextLazyLoad",
        "conjoon.cn_mail.store.mail.message.MessageItemStore",
        "coon.comp.grid.feature.RowFlyMenu",
        "coon.core.util.Date"
    ],

    alias: "widget.cn_mail-mailmessagegrid",

    /**
     * Gets fired when the conjoon.cn_mail.store.mail.message.MessageItemStore
     * beforeload-event fires. This relay is needed due to the late binding behavior
     * of the two-way-databinding. This event is not canceable.
     * @event cn_mail-mailmessagegridbeforeload
     * @param {conjoon.cn_mail.store.mail.message.MessageItemStore} store
     */

    /**
     * Gets fired when the conjoon.cn_mail.store.mail.message.MessageItemStore
     * load-event fires. This relay is needed due to the late binding behavior
     * of the two-way-databinding.
     * @event cn_mail-mailmessagegridload
     * @param {conjoon.cn_mail.store.mail.message.MessageItemStore} store
     */

    /**
     * "storeRelayers" was already taken
     * @private
     */
    myStoreRelayers: null,

    cls: "cn_mail-mailmessagegrid",

    flex: 1,

    headerBorders: false,
    rowLines: false,

    selModel: {
        toggleOnClick: false,
        pruneRemoved: false
    },

    tools: [{
        itemId: "cn_mail-mailmessagegrid-refresh",
        type: "refresh"
    }],

    /**
     * @i18n
     */
    emptyText: "This folder is empty.",

    /**
     * @type {String}
     * @private
     */
    representedFolderType: null,

    features: [{
        ftype: "cn_mail-mailmessagegridfeature-livegrid",
        id: "cn_mail-mailMessageFeature-livegrid"
    }, {
        ftype: "cn_webmailplug-previewtextlazyload",
        id: "cn_webmailplug-previewtextlazyload"
    }, {
        ftype: "cn_comp-gridfeature-rowbodyswitch",
        variableRowHeight: false,
        enableCls: "previewEnabled",
        disableCls: "previewDisabled",
        id: "cn_mail-mailMessageFeature-messagePreview",
        /**
         * Default empty subject text for MessageItems.
         * @i18n
         * @private
         */
        emptySubjectText: "(No subject)",
        getPreviewTextRow: record => `<div class="previewText">${Ext.util.Format.nbsp(record.get("previewText"))}</div>`,
        getAdditionalData: function (data, idx, record, orig) {

            const
                me     = this,
                CnDate = coon.core.util.Date;

            if (me.disabled) {
                return undefined;
            }

            return {
                rowBody:
                          "<div class=\"head" + (!record.get("seen") ? " unread" : "")+"\">" +
                          "<div class=\"subject"+ (!record.get("seen") ? " unread" : "")+"\">" +
                             (record.get("answered") ? "<span class=\"fa fa-mail-reply\"></span>" : "")+
                             (record.get("flagged") ? "<span class=\"fa fa-flag\"></span>" : "")+
                             (record.get("draft") ? "<span class=\"draft\">[Draft]</span>" : "") +

                          (record.get("subject") === "" ? me.emptySubjectText : record.get("subject")) +
                          "</div>" +
                          "<div class=\"date\">" + CnDate.getHumanReadableDate(record.get("date")) + "</div>" +
                          "</div>" +
                          me.getPreviewTextRow(record),
                rowBodyCls: "cn_mail-mailmessagepreviewfeature"
            };
        },
        previewColumnConfig: {
            "seen": {hidden: true},
            "subject": {hidden: true},
            "to": {hidden: true},
            "from": {hidden: true},
            "draftDisplayAddress": {flex: 1},
            "date": {hidden: true},
            "hasAttachments": {},
            "size": {hidden: true}
        }
    }, {
        ftype: "cn_comp-gridfeature-rowflymenu",
        id: "cn_mail-mailMessageFeature-rowFlyMenu",
        items: [{
            cls: "fa fa-trash",
            "data-qtip": "Delete Message",
            action: "delete",
            id: "cn_mail-mailMessageFeature-rowFlyMenu-delete"
        }, {
            cls: "fa fa-envelope",
            "data-qtip": "Mark as Unread",
            action: "markunread",
            id: "cn_mail-mailMessageFeature-rowFlyMenu-markUnread"
        }, {
            cls: "fa fa-flag",
            "data-qtip": "Add Flag",
            action: "flag",
            id: "cn_mail-mailMessageFeature-rowFlyMenu-flag"
        }],
        alignTo: ["tr-tr", [-12, 4]]
    }],

    viewConfig: {
        markDirty: false,
        getRowClass: function (record, rowIndex, rowParams, store){
            let cls = record.get("seen")
                ? ""
                : "boldFont";

            if (record.get("cn_deleted")) {
                cls += " cn-deleted";
            } else if (record.get("cn_moved")) {
                cls += " cn-moved";
            }

            return cls;
        }
    },

    columns: [{
        dataIndex: "seen",
        hideable: false,
        text: "<span class=\"x-fa fa-circle\"></span>",
        /**
         * @bug
         * BufferedStore only triggeres update of cell if at least metaData and
         * record are specified in its arguments. might be an issue with the
         * needsUpdate computing and considering argument values?
         */
        renderer: function (value, metaData, record) {
            return "<span class=\"" + (!value ? "fas" : "far")+ " fa-circle\"></span>";
        },
        menuDisabled: true,
        width: 40
    }, {
        dataIndex: "hasAttachments",
        hideable: false,
        text: "<span class=\"x-fa fa-paperclip\"></span>",
        renderer: function (value) {
            return value ? "<span class=\"x-fa fa-paperclip\"></span>" : "";
        },
        menuDisabled: true,
        width: 40
    }, {
        dataIndex: "subject",
        text: "Subject",
        width: 150
    }, {
        dataIndex: "to",
        text: "To",
        width: 240,
        renderer: function (value, meta, record, rowIndex, colIndex, store, view) {
            return view.grid.stringifyTo(value);

        }
    }, {
        dataIndex: "from",
        text: "From",
        width: 140,
        renderer: function (value, meta, record, rowIndex, colIndex, store, view) {

            var feature = view.getFeature("cn_mail-mailMessageFeature-messagePreview");

            if (!feature.disabled) {
                meta.tdCls += "previewLarge";
            }

            return value ? value.name : "";
        }
    }, {
        dataIndex: "draftDisplayAddress",
        hidden: true,
        hideable: false,
        text: "Draft Display Address",
        menuDisabled: true
    }, {
        dataIndex: "date",
        xtype: "datecolumn",
        format: "d.m.Y H:i",
        align: "right",
        text: "Date",
        width: 140
    }, {
        dataIndex: "size",
        align: "right",
        text: "Size",
        width: 80,
        renderer: Ext.util.Format.fileSize
    }],


    /**
     * Sets the represented folder type for this message grid.
     * The representedFolderType is an advise for the draftDisplayAddress-column
     * on how to render the address, e.g. whether from- or to-addresses should be
     * rendered.
     *
     * @param {String} representedFolderType
     *
     * @protected
     */
    setRepresentedFolderType: function (representedFolderType) {

        const me = this;

        me.representedFolderType = representedFolderType;
    },


    /**
     * @inheritdoc
     */
    initComponent: function () {

        const me = this;

        // apply Renderer to draftDisplayAddress columns
        for (let i = 0, len = me.columns.length; i < len; i++) {
            if (me.columns[i].dataIndex === "draftDisplayAddress") {
                me.columns[i].renderer = me.renderDraftDisplayAddress;
            }
        }

        me.callParent(arguments);

        me.relayEvents(
            me.view.getFeature("cn_mail-mailMessageFeature-rowFlyMenu"),
            ["itemclick", "beforemenushow"],
            "cn_comp-rowflymenu-"
        );
    },


    /**
     * Renderer for the draftDisplayAddress-column.
     *
     * @param value
     * @param meta
     * @param record
     * @param rowIndex
     * @param colIndex
     * @param store
     * @param view
     * @returns {*}
     *
     * @private
     */
    renderDraftDisplayAddress: function (value, meta, record, rowIndex, colIndex, store, view) {
        const me      = this,
            feature = view.getFeature("cn_mail-mailMessageFeature-messagePreview");

        if (!feature.disabled) {
            meta.tdCls += "previewLarge";
            if (record.get("draft") || me.representedFolderType === "SENT") {
                return view.grid.stringifyTo(record.get("to"));
            }
        }

        return record.get("from") ?  record.get("from").name : "";
    },


    /**
     * Allows to switch between preview- and detail view, whereas the detail
     * view is a regular gridpanel view with column headers and table cells,
     * and the preview view uses the {coon.comp.grid.feature.RowBodySwitch}.
     * This method will also enable/disable the RowFlyMenu (enabled only if
     * RowPreview is enabled).
     *
     * @param {Boolean} enable true to switch to the grid view, falsy to
     * switch to preview mode.
     */
    enableRowPreview: function (enable) {

        const me         = this,
            view       = me.getView(),
            feature    = view.getFeature("cn_mail-mailMessageFeature-messagePreview"),
            rowFlyMenu = view.getFeature("cn_mail-mailMessageFeature-rowFlyMenu");

        enable = enable === undefined ? true : !!enable;

        if (me.getStore().isLoading()) {
            Ext.raise({
                msg: "cannot call enableRowPreview during store's load-operation",
                isLoading: me.getStore().isLoading()
            });
        }

        let reqs =  me.getStore().pageRequests;
        for (let page in reqs) {
            if (!Object.prototype.hasOwnProperty.call(reqs, page)) {
                continue;
            }
            reqs[page].getOperation().abort();
        }

        me.getStore().reload();

        if (enable) {
            feature.enable();
            rowFlyMenu.enable();
        } else {
            feature.disable();
            rowFlyMenu.disable();
        }
    },


    /**
     * Overridden to relay events from the store to this grid
     *
     * @inheritdoc
     */
    bindStore: function (store, initial) {

        const me  = this;

        if (store && !store.isEmptyStore &&
            !(store instanceof conjoon.cn_mail.store.mail.message.MessageItemStore)) {
            Ext.raise({
                msg: "store must be an instance of \"conjoon.cn_mail.store.message.MessageItemStore\"",
                store: store
            });
        }

        if (store && me.getStore() !== store) {
            me.myStoreRelayers = me.relayEvents(store, ["beforeload", "load", "prefetch"], "cn_mail-mailmessagegrid");
        }

        return me.callParent(arguments);
    },


    /**
     * Overridden to detach relayed events.
     *
     * @inheritdoc
     */
    unbindStore: function (store) {

        const me = this;

        if (me.myStoreRelayers) {
            me.myStoreRelayers.destroy();
        }
        me.myStoreRelayers = null;

        return me.callParent(arguments);
    },


    /**
     * Updates the current RowFlyMenu for the specified record.
     * Updates the menu's items to represent the proper state for the following
     * properties:
     *  - seen
     *
     * @param {conjoon.cn_mail.model.mail.message.reader.MessageItem} record
     */
    updateRowFlyMenu: function (record) {

        const me       = this,
            feature  = me.view.getFeature("cn_mail-mailMessageFeature-rowFlyMenu"),
            menu     = feature.menu,
            readItem = menu.query("div[id=cn_mail-mailMessageFeature-rowFlyMenu-markUnread]", true),
            flagItem = menu.query("div[id=cn_mail-mailMessageFeature-rowFlyMenu-flag]", true);

        switch (record.get("seen")) {
        case (true):
            readItem[0].setAttribute("data-qtip",  "Mark as Unread");
            break;

        default:
            readItem[0].setAttribute("data-qtip",  "Mark as Read");
        }

        switch (record.get("flagged")) {
        case (true):
            flagItem[0].setAttribute("data-qtip",  "Remove Flag");
            break;

        default:
            flagItem[0].setAttribute("data-qtip",  "Add Flag");
        }
    },


    /**
     * Helper function to return an array containing address-like objects (keyed
     * with "address" and "name") as a string.
     *
     * @param {Array} toAddresses
     *
     * @return {String}
     */
    stringifyTo: function (toAddresses) {
        const names = [];

        for (var i = 0, len = toAddresses.length; i < len; i++) {
            names.push(toAddresses[i].name);
        }
        return names.join(", ");
    }


});
