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

describe('conjoon.cn_mail.data.mail.BaseSchemaTest', function(t) {

    t.requireOk('conjoon.cn_mail.model.mail.message.MessageItem', function(){
    t.requireOk('conjoon.cn_mail.model.mail.account.MailAccount', function(){
    t.requireOk('conjoon.cn_mail.model.mail.message.MessageDraft', function(){

        t.it("Should properly create the schema and check for default config", function(t) {

            var schema = Ext.create('conjoon.cn_mail.data.mail.BaseSchema');

            t.expect(schema instanceof coon.core.data.schema.BaseSchema).toBe(true);

            t.expect(schema.alias).toContain('schema.cn_mail-mailbaseschema');

            t.expect(schema.getProxy() instanceof Ext.util.ObjectTemplate ).toBe(true);
            t.expect(schema.getProxy().template.type).toBe('rest');
            t.expect(schema.getNamespace()).toBe('conjoon.cn_mail.model.mail.');

            t.expect(schema.id).toBe('cn_mail-baseschema');

            t.expect(schema.getUrlPrefix()).toBe('cn_mail');
        });


        t.it("Make sure proxy for MessageDraft and MessageItem is of type MessageEntityProxy", function(t) {

            var schema = Ext.create('conjoon.cn_mail.data.mail.BaseSchema');

            var ret = schema.constructProxy(conjoon.cn_mail.model.mail.message.MessageItem);

            t.expect(ret.type).toBe('cn_mail-mailmessageentityproxy');

            ret = schema.constructProxy(conjoon.cn_mail.model.mail.message.MessageDraft);

            t.expect(ret.type).toBe('cn_mail-mailmessageentityproxy');


            ret = schema.constructProxy(conjoon.cn_mail.model.mail.message.MessageBody);

            t.expect(ret.type).toBe('cn_mail-mailmessageentityproxy');
        });


        t.it("Make sure configured reader for MessageDraft and MessageItem is of type MessageItemJsonReader", function(t) {

            let schema = Ext.create('conjoon.cn_mail.data.mail.BaseSchema'),
                ret = schema.constructProxy(conjoon.cn_mail.model.mail.message.MessageItem),
                proxy;

            proxy = Ext.Factory.proxy(ret);
            t.isInstanceOf(proxy.getReader(), 'conjoon.cn_mail.data.mail.message.reader.MessageItemJsonReader');

            ret = schema.constructProxy(conjoon.cn_mail.model.mail.message.MessageDraft);
            proxy = Ext.Factory.proxy(ret);
            t.isInstanceOf(proxy.getReader(), 'conjoon.cn_mail.data.mail.message.reader.MessageItemJsonReader');


            ret = schema.constructProxy(conjoon.cn_mail.model.mail.message.MessageBody);
            proxy = Ext.Factory.proxy(ret);
            t.isInstanceOf(proxy.getReader(), 'conjoon.cn_mail.data.mail.message.reader.MessageEntityJsonReader');
            t.expect(proxy.getReader() instanceof conjoon.cn_mail.data.mail.message.reader.MessageItemJsonReader).toBe(false);
        });


        t.it("Make sure proxy for DraftAttachment and ItemAttachment is of type MessageItemChildProxy", function(t) {

            var schema = Ext.create('conjoon.cn_mail.data.mail.BaseSchema');

            var ret = schema.constructProxy(conjoon.cn_mail.model.mail.message.DraftAttachment);

            t.expect(ret.type).toBe('cn_mail-mailmessageattachmentproxy');

            ret = schema.constructProxy(conjoon.cn_mail.model.mail.message.ItemAttachment);

            t.expect(ret.type).toBe('cn_mail-mailmessageattachmentproxy');
        });


        t.it("Make sure proxy for MailAccount is of type MailAccountdProxy", function(t) {

            var schema = Ext.create('conjoon.cn_mail.data.mail.BaseSchema');

            var ret = schema.constructProxy(conjoon.cn_mail.model.mail.account.MailAccount);

            t.expect(ret.type).toBe('cn_mail-mailaccountproxy');
        });

    });


})})});