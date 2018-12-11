/**
 * conjoon
 * (c) 2007-2018 conjoon.org
 * licensing@conjoon.org
 *
 * app-cn_mail
 * Copyright (C) 2018 Thorsten Suckow-Homberg/conjoon.org
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
 * Helper class for updating MessageItems based on MessageDrafts.
 * Note:
 * =====
 * Updated values are not considered to be filtered and sanitized regarding
 * proper render output. This should be done by the views.
 *
 *
 * @example
 *
 * conjoon.cn_mail.data.mail.message.reader.MessageItemUpdater.updateItemWithDraft(
 *      messageItem, messageDraft
 * );
 *
 * @singleton
 */
Ext.define('conjoon.cn_mail.data.mail.message.reader.MessageItemUpdater', {


    singleton : true,

    requires : [
        'conjoon.cn_mail.model.mail.message.MessageItem',
        'conjoon.cn_mail.model.mail.message.MessageDraft'
    ],


    /**
     * Updates the fields in the target messageItem with data found in the fields
     * of the source MessageDraft.
     * This method will also commit the target record.
     *
     * The following fields are updated:
     *  - date
     *  - to
     *  - subject
     *  - hasAttachments
     *  - previewText
     *  - size
     *  - seen
     *  - answered
     *  - recent
     *  - flagged
     *  - draft
     *  - mailAccountId
     *  - id
     *
     * @param {conjoon.cn_mail.model.mail.message.MessageItem}  messageItem
     * @param {conjoon.cn_mail.model.mail.message.MessageDraft} messageDraft
     *
     * @return {conjoon.cn_mail.model.mail.message.MessageItem}
     *
     * @throws if messageDraft is not an instance of {conjoon.cn_mail.model.mail.message.MessageDraft},
     * or if if messageItem is not an instance of {conjoon.cn_mail.model.mail.message.MessageItem}
     */
    updateItemWithDraft : function(messageItem, messageDraft) {

        var me = this, size = 0, attachments, messageBody;

        if (!(messageItem instanceof conjoon.cn_mail.model.mail.message.MessageItem)) {
            Ext.raise({
                msg         : 'messageItem must be an instance of \'conjoon.cn_mail.model.mail.message.MessageItem\'',
                cls         : Ext.getClassName(me),
                messageItem : messageItem
            });
        }

        if (!(messageDraft instanceof conjoon.cn_mail.model.mail.message.MessageDraft)) {
            Ext.raise({
                msg          : 'messageDraft must be an instance of \'conjoon.cn_mail.model.mail.message.MessageDraft\'',
                cls          : Ext.getClassName(me),
                messageDraft : messageDraft
            });
        }

        attachments = messageDraft.attachments().getRange();
        messageBody = messageDraft.getMessageBody();

        size += messageBody.get('textPlain').length;
        size += messageBody.get('textHtml').length;

        for (var i = 0, len = attachments.length; i < len; i++) {
            size += attachments[i].get('size');
        }

        // from/to fields are COPYING the values so we do not
        // need to take care of cloning them
        messageItem.set({
            date           : messageDraft.get('date'),
            to             : messageDraft.get('to'),
            subject        : messageDraft.get('subject'),
            hasAttachments : attachments.length > 0,
            previewText    : messageBody.get('textPlain'),
            size           : size,
            from           : messageDraft.get('from'),
            seen           : messageDraft.get('seen'),
            flagged        : messageDraft.get('flagged'),
            recent         : messageDraft.get('recent'),
            answered       : messageDraft.get('answered'),
            draft          : messageDraft.get('draft')
        });

        messageItem.commit();

        return messageItem;
    },


    /**
     * Creates a new MessageItem based on the draft data.
     *
     * @param {conjoon.cn_mail.model.mail.message.MessageDraft} messageDraft
     *
     * @return {conjoon.cn_mail.model.mail.message.MessageItem}
     *
     * @throws if messageDraft is not an instance of {conjoon.cn_mail.model.mail.message.MessageDraft}
     *
     * @see updateItemWithDraft
     */
    createItemFromDraft : function(messageDraft) {

        const me = this;

        if (!(messageDraft instanceof conjoon.cn_mail.model.mail.message.MessageDraft)) {
            Ext.raise({
                msg          : 'messageDraft must be an instance of \'conjoon.cn_mail.model.mail.message.MessageDraft\'',
                cls          : Ext.getClassName(me),
                messageDraft : messageDraft
            });
        }

        let messageItem = Ext.create('conjoon.cn_mail.model.mail.message.MessageItem', {
            localId       : messageDraft.getId(),
            id            : messageDraft.get('id'),
            mailAccountId : messageDraft.get('mailAccountId'),
            mailFolderId  : messageDraft.get('mailFolderId'),
            messageBodyId : messageDraft.getMessageBody().getId()
        });

        return me.updateItemWithDraft(messageItem, messageDraft);

    }

});