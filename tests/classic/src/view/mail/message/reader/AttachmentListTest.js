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

describe('conjoon.cn_mail.view.mail.message.reader.AttachmentListTest', function(t) {

    var view,
        viewConfig;

    t.afterEach(function() {
       if (view) {
            view.destroy();
            view = null;
        }

    });

    t.beforeEach(function() {

        viewConfig = {

        }
    });


    t.it("Should create and show the attachment list along with default config checks", function(t) {
        view = Ext.create(
            'conjoon.cn_mail.view.mail.message.reader.AttachmentList', viewConfig);

        t.expect(view instanceof conjoon.cn_mail.view.mail.message.AbstractAttachmentList).toBeTruthy();

        t.expect(view.alias).toContain('widget.cn_mail-mailmessagereaderattachmentlist');

        t.expect(view.getController() instanceof conjoon.cn_mail.view.mail.message.reader.AttachmentListController).toBe(true);
    });

    t.it("Should test displayButtonType properly", function(t) {
        view = Ext.create(
            'conjoon.cn_mail.view.mail.message.reader.AttachmentList', viewConfig);

        var tests = [{
            expectREMOVE   : false,
            expectDOWNLOAD : true
        }];

        for (var i = 0, len = tests.length; i < len; i++) {
            t.expect(
                view.displayButtonType('REMOVE')
            ).toBe(tests[i]['expectREMOVE']);

            t.expect(
                view.displayButtonType('DOWNLOAD')
            ).toBe(tests[i]['expectDOWNLOAD']);
        }
    });

});
