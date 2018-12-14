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
 * AbstractCompoundKey for mail related entities (folders, mails, attachments...)
 * consisting of mailAccountId the id of the entity, not to confused with the
 * localId which should be configured as the idProperty for implementing models.
 * Data must be identified by a compound key, whereas localId is a unique string
 * built from the keys in this compound.This key is then used to identify local
 * records.
 *
 * Concrete implementations can be found in the namespace
 * conjoon.cn_mail.data.mail.message.compoundKey.* and
 * conjoon.cn_mail.data.mail.folder.compoundKey.*
 *
 * @abstract
 */
Ext.define('conjoon.cn_mail.data.mail.AbstractCompoundKey', {


    inheritableStatics : {

        /**
         * Creates a new CompoundKey based on the data found in fromRecord.
         *
         * @param {conjoon.cn_mail.model.mail.AbstractCompoundKeyedModel} rec
         *
         * @returns {conjoon.cn_mail.data.mail.AbstractCompoundKey}
         *
         * @throws if rec is not an instance of Ext.data.Model.
         */
        fromRecord : function(rec) {

            if (!(rec instanceof Ext.data.Model)) {
                Ext.raise({
                    msg : "\"rec\" must be an instance of Ext.data.Model",
                    rec : rec
                });
            }

            return new this({
                mailAccountId : rec.get('mailAccountId'),
                id            : rec.get('id')
            });

        },


        /**
         * Creates a new CompoundKey based on the passed arguments.
         *
         * @param {String} mailAccountId
         * @param {String} id
         *
         * @returns {conjoon.cn_mail.data.mail.message.CompoundKey}
         */
        createFor : function(mailAccountId, id) {

            return new this({
                mailAccountId : mailAccountId,
                id            : id
            });

        }

    },


    config : {
        /**
         * @type {String}
         */
        mailAccountId : undefined,

        /**
         * @type {String}
         */
        id    : undefined
    },


    /**
     * Constructor.
     *
     * @param {Object} cfg
     *
     * @throws if mailAccountId, mailFolderId or id are not set
     */
    constructor : function(cfg) {

        const me = this;

        if (!cfg || !cfg.mailAccountId || !cfg.id) {
            Ext.raise({
                msg : "\"cfg\" must be an object containing the properties " +
                "mailAccountId and id",
                cfg : cfg
            })
        }

        me.initConfig(cfg);
    },


    /**
     * Returns an array representation of this obejct, in the following order:
     * 0 - mailAccountId
     * 1 - id
     *
     * @returns {Array}
     */
    toArray : function() {

        const me = this;

        return [
            me.getMailAccountId(),
            me.getId()
        ];

    },


    /**
     * Returns an object representation of this compound key.
     *
     * @returns {{mailAccountId, id}}
     */
    toObject : function() {

        const me = this;

        return {
            mailAccountId : me.getMailAccountId(),
            id            : me.getId()
        };

    },


    /**
     * Returns the localId used as the primary key for a data entity which can
     * be identified by "this" compound key.
     *
     * @returns {string}
     */
    toLocalId : function() {
        const me = this;

        return me.getMailAccountId() + '-' +  me.getId();
    },


    /**
     * Applies mailAccountId.
     *
     * @param {String} mailAccountId
     *
     * @return {String}
     *
     * @throws exception if mailAccountId was already set
     */
    applyMailAccountId : function(mailAccountId) {

        const me = this;

        if (me.getMailAccountId() !== undefined) {
            Ext.raise({
                msg           : "\"mailAccountId\" was already set",
                mailAccountId : me.getMailAccountId()
            });
        }

        return mailAccountId;
    },


    /**
     * Applies id.
     *
     * @param {String} id
     *
     * @return {String}
     *
     * @throws exception if id was already set
     */
    applyId : function(id) {

        const me = this;

        if (me.getId() !== undefined) {
            Ext.raise({
                msg : "\"id\" was already set",
                id  : me.getId()
            });
        }

        return id;
    },


    /**
     * Returns true if this CompoundKey references the same compound keys
     * as the passed compound key.
     *
     * @param {conjoon.cn_mail.data.mail.AbstractCompoundKey} cmp
     *
     * @return {Boolean}
     */
    equalTo : function(cmp) {

        const me = this;

        if (!(cmp instanceof conjoon.cn_mail.data.mail.AbstractCompoundKey)) {
            return false;
        }

        return me.toLocalId() === cmp.toLocalId();
    }

});
