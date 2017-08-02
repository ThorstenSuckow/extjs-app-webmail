/**
 * conjoon
 * (c) 2007-2017 conjoon.org
 * licensing@conjoon.org
 *
 * app-cn_mail
 * Copyright (C) 2017 Thorsten Suckow-Homberg/conjoon.org
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * The default MessageEditor for editing/creating messages. By default, this
 * view is configured with a {@link conjoon.cn_mail.view.mail.message.editor.MessageEditorViewModel}
 * and a {@link conjoon.cn_mail.view.mail.message.editor.MessageEditorViewController}.
 * The view model takes care of initializing the needed {@link conjoon.cn_mail.model.mail.message.MessageDraft}
 * which will either be loaded into this view or created as a phantom for
 * initial saving.
 *
 *
 * editMode Context:
 * =================
 * When creating an instance of this class, the editMode should be specified
 * based upon the context the editor is opened with. The editMode can either
 * be "CREATE" or "EDIT". Note: the editMode is only important for the initial
 * firing up of this view. Once a phantom messageDraft gets saved and has a physical
 * id, it is not needed to change the editMode from "CREATE" to "EDIT".
 *
 *
 * Session:
 * ==============
 * This view uses a session with the {@link conjoon.cn_mail.data.mail.BaseSchema}
 * to be able to handle the associations of the used data models properly.
 * The constructor overrides any specified session by creating an individual
 * session of the type {@link conjoon.cn_core.Session} with a
 * {@link conjoon.cn_core.session.SplitBatchVisitor} to make sure multiple
 * attachments are uploaded in single requests.
 *
 *
 * Note:
 * ==============
 * When extending this class, it is mandatory for the extended class to have
 * a {@link conjoon.cn_mail.view.mail.message.editor.AttachmentList} embedded.
 *
 *
 * Different initial model options:
 * ==================================
 * Instances of this class can be initially configured with various options for
 * the MessageDraft that should be used.
 * By specifying no options at all, an empty MessageDraft is created which gets
 * saved as a completely new Message.
 *
 *  @example
 *     // MessageEditor will be created with an empty MessageDraft.
 *     // editMode will be set to "CREATE", regardless of any editMode configuration
 *     // passed to the constructor
 *     Ext.create('conjoon.cn_mail.view.mail.message.editor.MessageEditor');

 *
 * By specifying the configuration option "messageConfig", you can configure the
 * MessageDraft as follows:
 *  - none: MessageDraft will be created completely from scratch
 *  - {to: 'nam@domain.tld'} MessageDraft will be created completely from scratch,
 *  but the 'to'-address field will be set to the value of the to property
 *  - {id : [string]} The MessageDraft with the specified id will be loaded from
 *  the server, and the form fields will be set to the returned data accordingly.
 *
 *     @example
 *     // MessageEditor will be created and the MessageDraft with the specified
 *     // id "3" will be requested from the backend, editMode will be set to "EDIT",
 *     // regardless of any editMode configuration passed to the constructor
 *     Ext.create('conjoon.cn_mail.view.mail.message.MessageEditor', {
 *          messageConfig : {
 *             id   : '3'
 *          }
 *     });
 *
 *     // MessageEditor will be created with a phantom MessageDraft, and it's
 *     // to-Address will be initial set to 'name@domain.tld'
 *     // editMode will be set to CREATE
 *     Ext.create('conjoon.cn_mail.view.mail.message.editor.MessageEditor', {
 *          messageConfig : {
 *              // the to property can be configured according to the specs
 *              // of conjoon.cn_mail.model.mail.message.EmailAddress or
 *              // conjoon.cn_core.data.field.EmailAddressCollection
 *              to : 'name@domain.tld'
 *          }
 *     });
 *
 * @see conjoon.cn_mail.view.mail.message.editor.MessageEditorViewModel
 */
Ext.define('conjoon.cn_mail.view.mail.message.editor.MessageEditor', {

    extend : 'Ext.form.Panel',

    requires : [
        'conjoon.cn_comp.component.LoadMask',
        'conjoon.cn_mail.view.mail.message.editor.AttachmentList',
        'conjoon.cn_mail.view.mail.message.editor.MessageEditorViewController',
        'conjoon.cn_mail.view.mail.message.editor.MessageEditorViewModel',
        'conjoon.cn_mail.view.mail.message.editor.HtmlEditor',
        'conjoon.cn_mail.view.mail.message.editor.AddressField',
        'conjoon.cn_mail.data.mail.message.editor.MessageDraftConfig',
        'conjoon.cn_mail.model.mail.message.EmailAddress',
        'conjoon.cn_mail.data.mail.BaseSchema',
        'conjoon.cn_core.data.Session',
        'conjoon.cn_core.data.session.SplitBatchVisitor'
    ],

    alias : 'widget.cn_mail-mailmessageeditor',

    statics : {
        /**
         * @type {String} MODE_EDIT
         */
        MODE_EDIT : 'EDIT',

        /**
         * @type {String} MODE_CREATE
         */
        MODE_CREATE : 'CREATE'
    },

    controller : 'cn_mail-mailmessageeditorviewcontroller',

    viewModel : 'cn_mail-mailmessageeditorviewmodel',

    /**
     * Gets fired when a save of the MessageDraft was initiated and the associated
     * saveBatch is about to get processed.
     * @event cn_mail-mailmessagebeforesave
     * @param this
     * @param {conjoon.cn_mail.model.mail.message.MessageDraft} messageDraft
     * @param {Ext.data.Batch} batch The batch that was generated for processing
     */

    /**
     * Gets fired when a save of the MessageDraft was initiated and a single
     * operation completes.
     * @event cn_mail-mailmessagesaveoperationcomplete
     * @param this
     * @param {conjoon.cn_mail.model.mail.message.MessageDraft} messageDraft
     * @param {Ext.data.operation.Operation} operation The operation that was
     * completed
     */

    /**
     * Gets fired when a save of the MessageDraft was initiated and a single
     * operation triggered an exception.
     * @event cn_mail-mailmessagesaveoperationexception
     * @param this
     * @param {conjoon.cn_mail.model.mail.message.MessageDraft} messageDraft
     * @param {Ext.data.operation.Operation} operation The operation that caused
     * the exception
     */

    /**
     * Gets fired when a save of the MessageDraft was initiated and all individual
     * operations were processed successfully.
     * @event cn_mail-mailmessagesavecomplete
     * @param this
     * @param {conjoon.cn_mail.model.mail.message.MessageDraft} messageDraft
     * @param {Ext.data.operation.Operation} operation The last operation that
     * was processed.
     */

    layout : {
        type  : 'vbox',
        align : 'stretch'
    },

    margin : '0 5 14 0',

    bodyPadding : '8 8 8 8',

    cls    : 'cn_mail-mailmessageeditor shadow-panel',

    /**
     * @i18n
     */
    title : 'Loading...',

    iconCls : "fa fa-spin fa-spinner",

    bind : {
        closable : '{isSaving ? false : true}',
        title    : '{getSubject}',
        iconCls  : '{getSubject && !isSaving ? "fa fa-edit" : "fa fa-spin fa-spinner"}'
    },

    closable : true,

    buttonAlign : 'right',

    /**
     * @private {String="CREATE"} editMode any of CREATE or EDIT
     * The editMode will be passed to the embedded
     * {@link conjoon.cn_mail.view.mail.message.AttachmentList}
     */
    editMode : 'CREATE',

    /**
     * Mask to indicate that the oomponent's input is currently blocked due to
     * a user triggered save process
     * @private {conjoon.cn_comp.component.LoadMask} busyMask
     * @see setBusy
     */
    busyMask : null,

    buttons : [{
        text   : 'Save',
        width  : 108,
        itemId : 'saveButton'
    }, {
        text   : 'Send',
        itemId : 'sendButton',
        width  : 108
    }],

    items : [{
        xtype  : 'container',
        margin : '0 0 12 0',
        layout : 'hbox',
        items : [{
            flex      : 1,
            xtype     : 'cn_mail-mailmessageeditoraddressfield',
            emptyText : 'To',
            itemId    : 'toField',
            bind : {
                value : '{getTo}',
                store : '{addressStore}'
            }
        }, {
            xtype  : 'button',
            itemId : 'showCcBccButton',
            cls    : 'showCcBccButton',
            text   : 'CC / BCC',
            ui     : 'button-lightest-color',
            bind   : {
                hidden : '{isCcOrBccValueSet}'
            }
        }]}, {
        xtype       : 'cn_mail-mailmessageeditoraddressfield',
        emptyText   : 'Cc',
        itemId      : 'ccField',
        addressType : 'cc',
        bind        : {
            hidden : {
                bindTo : '{!isCcOrBccValueSet}',
                single : true
            },
            value : '{getCc}',
            store : '{addressStore}'
        }
    }, {
        xtype       : 'cn_mail-mailmessageeditoraddressfield',
        emptyText   : 'Bcc',
        addressType : 'bcc',
        itemId      : 'bccField',
        bind        : {
            hidden : {
                bindTo : '{!isCcOrBccValueSet}',
                single : true
            },
            value : '{getBcc}',
            store : '{addressStore}'
        }
    }, {
        xtype      : 'textfield',
        emptyText  : 'Subject',
        cls        : 'subjectField',
        itemId     : 'subjectField',
        bind       : {
            value : '{messageDraft.subject}'
        }
    }, {
        xtype  : 'container',
        flex   : 1,
        margin : '12 0 0 0',
        layout : {
            type : 'hbox',
            align : 'stretch'
        },
        items : [{
            flex  : 1,
            xtype : 'cn_mail-mailmessageeditorhtmleditor',
            bind  : {
                value : '{messageDraft.messageBody.textHtml}'
            }
        }, {
            xtype      : 'container',
            itemId     : 'attachmentListWrap',
            cls        : 'attachmentlist-wrap',
            layout     : 'fit',
            width      : 230,
            margin     : '0 0 0 10',
            items      : [{
                xtype  : 'box',
                autoEl : {
                    tag  : 'div',
                    cls  : 'dropzone-text',
                    html : 'Attach files by dragging and dropping them here.'
                }
            }, {
                flex : 1,
                xtype      : 'cn_mail-mailmessageeditorattachmentlist',
                reference  : 'cn_mail_ref_mailmessageeditorattachmentlist',
                margin     : '10 0 10 0',
                width      : 228,
                scrollable : 'y',
                bind       : {
                    store  : '{messageDraft.attachments}'
                }
            }]
        }]
    }],


    /**
     * @inheritdoc
     *
     * Overrides any specified session by creating an individual session of the
     * type conjoon.cn_core.Session with a conjoon.cn_core.session.BatchVisitor.
     *
     * @throws if both viewModel and messageConfig want to be configured when
     * creating an instance of this class, or if editMode was not specified.
     */
    constructor : function(config) {

        var me         = this,
            draftConfig = {
                type   : 'MessageDraft'
            },
            messageDraft;

        if ([me.statics().MODE_EDIT, me.statics().MODE_CREATE].indexOf(config.editMode) === -1) {
            Ext.raise({
                editMode : config.editMode,
                msg      : "\"editMode\" is invalid"
            });
        }

        config.session = Ext.create('conjoon.cn_core.data.Session', {
            schema                : 'cn_mail-mailbaseschema',
            batchVisitorClassName : 'conjoon.cn_core.data.session.SplitBatchVisitor'
        });

        if (config.messageDraft && config.viewModel) {
            Ext.raise({
                source : Ext.getClassName(this),
                msg    : 'Can only set messageConfig or viewModel, not both.'
            })
        }

        messageDraft = config.messageDraft;

        switch (config.editMode) {

            case me.statics().MODE_CREATE:
                messageDraft       = config.messageDraft;
                draftConfig.create = messageDraft instanceof conjoon.cn_mail.data.mail.message.editor.MessageDraftConfig
                    ? messageDraft.toObject()
                    : true;
                break;

            case me.statics().MODE_EDIT:
                messageDraft = config.messageDraft;
                if (!messageDraft || Ext.isObject(messageDraft)) {
                    Ext.raise({
                        messageDraft : messageDraft,
                        editMode     : config.editMode,
                        msg          : "unexpected value for \"messageDraft\""
                    });
                }
                draftConfig.id = messageDraft;
                break;

            default:
                Ext.raise({
                    editMode     : config.editMode,
                    messageDraft : messageDraft,
                    msg          : "unexpected value for \"messageDraft\""
                });
        }

        config.viewModel = {
            type  : 'cn_mail-mailmessageeditorviewmodel',
            links : {
                messageDraft : draftConfig
            }
        };



        delete config.messageDraft;

        this.callParent(arguments);
    },


    /**
     * @inheritdoc
     *
     * @throws if no {@link conjoon.cn_mail.view.mail.message.AttachmentList}
     * was found.
     */
    initComponent : function() {

        var me    = this,
            item  = null,
            query = function(items) {
                Ext.each(items, function(value) {
                    if (value.xtype == 'cn_mail-mailmessageeditorattachmentlist') {
                        item = value;
                        return false;
                    }
                    if (value.items) {
                        return query(value.items);
                    }

                })
            };

        query(me.items);
        if (item) {
            item.editMode = me.editMode;
        } else {
            Ext.raise({
                sourceClass : Ext.getClassName(me),
                msg         : "MessageEditor needs to have conjoon.cn_mail.view.mail.message.AttachmentList"
            });
        }

        me.callParent(arguments);
    },


    /**
     * Shows the CC / BCC fields or hides them depending on the passed argument.
     *
     * @param {Boolean="true"} show True to show the CC and BCC field, false
     * to hide them.
     *
     * @return this
     */
    showCcBccFields : function(show) {
        var me   = this,
            show = show === undefined ? true : show;

        me.down('#ccField').setHidden(!show);
        me.down('#bccField').setHidden(!show);

        return this;
    },


    /**
     * Updates this editor's view to indicate that it is currently busy saving
     * data. The indicator is represented by a conjoon.cn_comp.component.LoadMask.
     *
     * @param {String|Object|Boolean} msg false to hide any currently active
     * indicator, a string containing a message to display or an object containing
     * a msg and a progress property to be applied to the generated
     * conjoon.cn_comp.component.LoadMask
     *
     * @return this
     *
     * @see #busyMask
     */
    setBusy : function(msg) {

        var me       = this,
            mask     = me.busyMask,
            progress = Ext.isObject(msg) ? msg.progress : undefined,
            msg      = Ext.isObject(msg) ? msg.msg      : msg;

        if (msg === false && !mask) {
            return this;
        }

        if (!mask && msg !== false) {
            mask = Ext.create('conjoon.cn_comp.component.LoadMask', {
                msg       : 'Saving Mail',
                msgAction : 'Stand by...',
                glyphCls  : 'fa fa-envelope',
                target    : me
            });
            me.busyMask = mask;
        }

        if (msg === false) {
            mask.hide();
            return this;
        }

        if (mask.isHidden()) {
            if (progress === undefined) {
                mask.loopProgress();
            }

            mask.show();
        }

        if (progress !== undefined) {
            mask.updateProgress(progress);
        }

        mask.updateActionMsg(msg);

        return this;
    }

});
