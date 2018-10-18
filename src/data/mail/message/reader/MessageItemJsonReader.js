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
 * Specialized version of a JSON Reader used by MessageItemProxyMessageItem.
 */
Ext.define('conjoon.cn_mail.data.mail.message.reader.MessageItemJsonReader', {

    extend : 'Ext.data.reader.Json',

    requires : [
        'conjoon.cn_mail.data.mail.message.compoundKey.MessageItemCompoundKey'
    ],

    alias : 'reader.cn_mail-mailmessageitemjsonreader',

    rootProperty : 'data',


    /**
     * @inheritdoc
     *
     * @return {Object}
     *
     * @throws if data is is not an object, or if the embedded property "data" is
     * neither an array nor an object
     *
     * @see applyCompoundKey
     */
    readRecords : function(data, readOptions, internalReadOptions) {

        const me = this;

        data = me.applyCompoundKey(data);

        return me.callParent([data, readOptions, internalReadOptions]);
    },


    /**
     * Computes the localId which is treated as the primary key for MessageItems
     * by utilizing conjoon.cn_mail.data.mail.message.compoundKey.MessageItemCompoundKey
     *
     * @param {Object} data
     *
     * @return {Boolean|Object}
     */
    applyCompoundKey : function(data) {

        const me                    = this,
            MessageItemCompoundKey  = conjoon.cn_mail.data.mail.message.compoundKey.MessageItemCompoundKey;


        if (Ext.isObject(data)) {

            if (Ext.isArray(data.data)) {

                let records = data.data, i, len = records.length, rec;

                for (i = 0; i < len; i++) {
                    rec = records[i];
                    if (!rec.localId) {
                        rec.localId = MessageItemCompoundKey.createFor(
                            rec.mailAccountId, rec.mailFolderId, rec.id
                        ).toLocalId();
                    }

                }

                return data;

            } else if (Ext.isObject(data.data)) {
                // POST / PUT
                data.data.localId = MessageItemCompoundKey.createFor(
                    data.data.mailAccountId, data.data.mailFolderId, data.data.id
                ).toLocalId();

                return data;
            }
        }

        Ext.raise({
            msg  : "The \"data\" property was malformed and could not be processed by this Reader",
            data : data
        });

    }



});