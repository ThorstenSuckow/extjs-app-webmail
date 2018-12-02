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

describe('conjoon.cn_mail.text.mail.message.CopyDecoratorTest', function(t) {

    var createMessageDraft = function(andBodyToo, skipReplyTo, andAttachmentsTo) {
        var draft = Ext.create('conjoon.cn_mail.model.mail.message.MessageDraft', {
            subject : 'SUBJECT',
            from    : 'from@domain.tld',
            to      : 'to@domain.tld',
            cc      : 'cc@domain.tld',
            bcc     : 'bcc@domain.tld',
            seen    : Math.random() >= 0.5 === true,
            flagged  : Math.random() >= 0.5 === true,
            recent   : Math.random() >= 0.5 === true,
            answered : Math.random() >= 0.5 === true,
            draft    : Math.random() >= 0.5 === true
        });

        if (skipReplyTo !== true) {
            draft.set('replyTo', 'replyTo@domain.tld');
        }

        if (andBodyToo === true) {
            draft.setMessageBody(Ext.create('conjoon.cn_mail.model.mail.message.MessageBody', {
                textPlain : 'TEXTPLAIN',
                textHtml  : 'TEXTHTML'
            }));
        }

        if (andAttachmentsTo === true) {
            draft.attachments().add(Ext.create('conjoon.cn_mail.model.mail.message.DraftAttachment', {
                type           : 'TYPE',
                text           : 'foo',
                size           : 1,
                previewImgSrc  : 'PREVIEWIMGSRC',
                downloadImgUrl : 'DOWNLOADIMGURL',
                sourceId       : 'SOURCEID'
            }));
        }

        return draft;
    };


    t.it("constructor()", function(t) {

        var exc, e, decorator;

        try {
            decorator = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', {});
        } catch (e) {exc = e;}

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toContain("must be an instance of");
        exc = e = undefined;

        try {
            decorator = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', createMessageDraft());
        } catch (e) {
            exc = e
        }

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toContain("is not available");
        exc = e = undefined;

        try {
            decorator = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', createMessageDraft(true, true, false));
        } catch (e) {
            exc = e
        }

        t.expect(exc).toBeDefined();
        t.expect(exc.msg).toContain("are not available");
        exc = e = undefined;


    });


    t.it("API", function(t) {

        var messageDraft = createMessageDraft(true, false, true),
            decorator    = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', messageDraft),
            tests        = [{
                fn   : 'getTextHtml',
                toBe : messageDraft.getMessageBody().get('textHtml')
            }, {
                fn   : 'getTextPlain',
                toBe : messageDraft.getMessageBody().get('textPlain')
            }, {
                fn   : 'getSubject',
                toBe : messageDraft.get('subject')
            }, {
                fn   : 'getSeen',
                toBe : true
            }, {
                fn   : 'getRecent',
                toBe : false
            }, {
                fn   : 'getDraft',
                toBe : true
            }, {
                fn   : 'getAnswered',
                toBe : false
            }, {
                fn   : 'getFlagged',
                toBe : false
            }, {
                fn      : 'getFrom',
                toEqual : messageDraft.get('from')
            }, {
                fn      : 'getReplyTo',
                toEqual : messageDraft.get('replyTo')
            }, {
                fn      : 'getTo',
                toEqual : messageDraft.get('to')
            }, {
                fn      : 'getCc',
                toEqual : messageDraft.get('cc')
            }, {
                fn      : 'getBcc',
                toEqual : messageDraft.get('bcc')
            }],
            fn, op, value;


        for (var i = 0, len = tests.length; i < len; i++) {

            fn    = tests[i].fn;
            op    = tests[i].hasOwnProperty('toBe') ? 'toBe' : 'toEqual';
            value = op === 'toBe' ? tests[i].toBe : tests[i].toEqual;

            t.expect(decorator[fn]())[op](value)
        }

    });


    t.it("empty replyTo", function(t) {

        var messageDraft = createMessageDraft(true, true, true),
            decorator    = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', messageDraft);

        t.expect(messageDraft.get('replyTo')).toBeFalsy();
        t.expect(decorator.getReplyTo()).toEqual(messageDraft.get('from'));
    });


    t.it("getAttachments()", function(t) {

        var messageDraft   = createMessageDraft(true, true, true),
            decorator      = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', messageDraft),
            attachments    = messageDraft.attachments().getRange(),
            newAttachments = decorator.getAttachments(),
            expectedKeys   = 'type,text,size,previewImgSrc,downloadImgUrl,sourceId'.split(',');

        t.expect(attachments.length).toBeGreaterThan(0);
        t.expect(newAttachments.length).toBe(attachments.length);



        for (var i = 0, len = newAttachments.length; i < len; i++) {

            for (var a = 0, lena = expectedKeys.length; a < lena; a++) {

                t.expect(newAttachments[i][expectedKeys[a]]).toBe(attachments[i].get(expectedKeys[a]));

            }
        }

    });


    t.it("toMessageDraftConfig()", function(t) {

        var messageDraft   = createMessageDraft(true, true, true),
            decorator      = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', messageDraft);

        t.isCalledOnce('getTo', decorator);
        t.isCalledOnce('getCc', decorator);
        t.isCalledOnce('getBcc', decorator);
        t.isCalledOnce('getSubject', decorator);
        t.isCalledOnce('getTextPlain', decorator);
        t.isCalledOnce('getTextHtml', decorator);
        t.isCalledOnce('getAttachments', decorator);

        t.isCalledOnce('getSeen',      decorator);
        t.isCalledOnce('getFlagged',      decorator);
        t.isCalledOnce('getRecent',      decorator);
        t.isCalledOnce('getAnswered',      decorator);
        t.isCalledOnce('getDraft',      decorator);

        t.isInstanceOf(decorator.toMessageDraftConfig(), 'conjoon.cn_mail.data.mail.message.editor.MessageDraftConfig');

    });


    t.it("toMessageDraftConfig() compare", function(t) {

        var messageDraft       = createMessageDraft(true, true, true),
            decorator          = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', messageDraft),
            messageDraftConfig = decorator.toMessageDraftConfig();

        t.expect(decorator.getTo()).toEqual(messageDraftConfig.getTo());
        t.expect(decorator.getCc()).toEqual(messageDraftConfig.getCc());
        t.expect(decorator.getBcc()).toEqual(messageDraftConfig.getBcc());
        t.expect(decorator.getSubject()).toBe(messageDraftConfig.getSubject());
        t.expect(decorator.getTextPlain()).toBe(messageDraftConfig.getTextPlain());
        t.expect(decorator.getTextHtml()).toBe(messageDraftConfig.getTextHtml());
        t.expect(decorator.getAttachments()).toEqual(messageDraftConfig.getAttachments());

        t.expect(decorator.getSeen()).toBe(true);
        t.expect(decorator.getDraft()).toBe(true);
        t.expect(decorator.getAnswered()).toBe(false);
        t.expect(decorator.getRecent()).toBe(false);
        t.expect(decorator.getFlagged()).toBe(false);
    });


    t.it("toMessageDraftConfig() - apply", function(t) {

        var messageDraft       = createMessageDraft(true, true, true),
            decorator          = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', messageDraft),
            messageDraftConfig = decorator.toMessageDraftConfig({
                to : 'foobar',
                mailFolderId : 'foo',
                mailAccountId : 'bar'
            });

        t.expect(decorator.getTo()).not.toBe('foobar');
        t.expect(messageDraftConfig.getTo()).toEqual(decorator.getTo());
        t.expect(messageDraftConfig.getMailFolderId()).toBe('foo');
        t.expect(messageDraftConfig.getMailAccountId()).toBe('bar');

    });


    t.it("app-cn_mail#80", function(t) {

        let createDraft = function(wFrom) {
            let cfg = {},
                messageDraft;

            if (wFrom) {
                cfg.from = 'test';
            }

            messageDraft = Ext.create('conjoon.cn_mail.model.mail.message.MessageDraft', cfg);

            messageDraft.setMessageBody(Ext.create('conjoon.cn_mail.model.mail.message.MessageBody', {}));
            messageDraft.attachments().add(Ext.create('conjoon.cn_mail.model.mail.message.DraftAttachment', {}));

            return messageDraft;
        };

        let messageDraft = createDraft(true);
        let decorator = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', messageDraft);

        t.expect(decorator.getFrom()).toEqual({name : 'test', address : 'test'});

        messageDraft = createDraft(false);
        decorator = Ext.create('conjoon.cn_mail.text.mail.message.CopyDecorator', messageDraft);

        t.expect(decorator.getFrom()).toBe(null);


    });

});
