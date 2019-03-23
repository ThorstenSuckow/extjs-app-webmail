/**
 * conjoon
 * app-cn_mail
 * Copyright (C) 2019 Thorsten Suckow-Homberg https://github.com/conjoon/app-cn_mail
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

describe('conjoon.cn_mail.data.mail.message.compoundKey.AttachmentItemCompoundKeyTest', function(t) {

    const create = function(cfg) {
            return Ext.create('conjoon.cn_mail.data.mail.message.compoundKey.AttachmentItemCompoundKey', cfg);
        },
        MAILACCOUNTID       = "foo",
        MAILFOLDERID        = "bar",
        PARENTMESSAGEITEMID = "barfoo",
        ID                  = "foobar";


    t.it("constructor() / apply*()", function(t) {

        let key = create({
            mailAccountId       : MAILACCOUNTID,
            mailFolderId        : MAILFOLDERID,
            parentMessageItemId : PARENTMESSAGEITEMID,
            id                  : ID
        });

        t.expect(key.getMailAccountId()).toBe(MAILACCOUNTID);
        t.expect(key.getMailFolderId()).toBe(MAILFOLDERID);
        t.expect(key.getParentMessageItemId()).toBe(PARENTMESSAGEITEMID);
        t.expect(key.getId()).toBe(ID);

        t.isInstanceOf(key, 'conjoon.cn_mail.data.mail.message.compoundKey.MessageItemChildCompoundKey');

    });


    t.it("fromRecord()", function(t) {

        let key = conjoon.cn_mail.data.mail.message.compoundKey.AttachmentItemCompoundKey.fromRecord(Ext.create('Ext.data.Model', {
            mailAccountId : MAILACCOUNTID, mailFolderId : MAILFOLDERID, parentMessageItemId : PARENTMESSAGEITEMID, id : ID
        }));

        t.isInstanceOf(key, 'conjoon.cn_mail.data.mail.message.compoundKey.AttachmentItemCompoundKey');

    });


    t.it("createFor()", function(t) {

        let key = conjoon.cn_mail.data.mail.message.compoundKey.AttachmentItemCompoundKey.createFor(
            MAILACCOUNTID, MAILFOLDERID, PARENTMESSAGEITEMID, ID
        );

        t.isInstanceOf(key, 'conjoon.cn_mail.data.mail.message.compoundKey.AttachmentItemCompoundKey');
    });

});