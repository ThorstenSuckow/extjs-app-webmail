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
 * Ext.ux.ajax.SimManager hook for {@link conjoon.cn_mail.model.mail.message.ItemAttachment}
 * and {@link conjoon.cn_mail.model.mail.message.DraftAttachment}
 * data.
 */
Ext.define('conjoon.cn_mail.data.mail.ajax.sim.message.AttachmentSim', {

    requires : [
        'conjoon.cn_mail.data.mail.ajax.sim.Init',
        'conjoon.cn_mail.data.mail.ajax.sim.message.AttachmentTable'
    ]

}, function() {

    var AttachmentTable = conjoon.cn_mail.data.mail.ajax.sim.message.AttachmentTable;

    Ext.ux.ajax.SimManager.register({
        type : 'json',

        url  : /cn_mail\/Attachment(\/.+)?/,

        doDelete : function(ctx) {

            console.log("DELETE Attachment", ctx.xhr.options);

            var me  = this,
                id  = ctx.url.match(this.url)[1].substring(1);
                ret = {};

            AttachmentTable.deleteAttachment(id);

            ret.responseText = Ext.JSON.encode({
                success :true
            });

            Ext.Array.forEach(me.responseProps, function (prop) {
                if (prop in me) {
                    ret[prop] = me[prop];
                }
            });
            return ret;

        },

        doPost : function(ctx) {

            console.log("POST Attachment", ctx.xhr.options.records[0].data);

            var me         = this,
                attachment = {},
                rec        = {},
                ret        = {};

            for (var i in ctx.xhr.options.records[0].data) {
                if (!ctx.xhr.options.records[0].data.hasOwnProperty(i)) {
                    continue;
                }

                attachment[i] = ctx.xhr.options.records[0].data[i];
            }


            rec = AttachmentTable.createAttachment(attachment);

            ret.responseText = Ext.JSON.encode({
                id            : rec.id,
                originalId    : rec.originalId,
                mailAccountId : rec.mailAccountId,
                mailFolderId  : rec.mailFolderId,
                success       : true
            });

            Ext.Array.forEach(me.responseProps, function (prop) {
                if (prop in me) {
                    ret[prop] = me[prop];
                }
            });
            return ret;
        },

        data: function(ctx) {

            var idPart  = ctx.url.match(this.url)[1],
                params  = ctx.params,
                filters = params.filter,
                id, attachments;

            if (idPart) {

                id = idPart.substring(1).split('?')[0];
                console.log("GET", "Attachment", id, params.mailAccountId,
                    params.mailFolderId, params.originalMessageItemId, new Date());
                return AttachmentTable.getAttachment(
                    id,
                    params.mailAccountId,
                    params.mailFolderId,
                    params.originalMessageItemId
                );

            } else if (filters) {
                filters = Ext.decode(filters);


                let account             = filters[0].value;
                let folder              = filters[1].value;
                let parentMessageItemId = filters[2].value;
                attachments = AttachmentTable.getAttachments(account, folder, parentMessageItemId);
                console.log("GET", "Attachments for Message id", account, folder, parentMessageItemId, new Date(), attachments);
                return attachments;
            } else {
                return [{text : "NOT SUPPORTED"}];
            }
        }
    });

});