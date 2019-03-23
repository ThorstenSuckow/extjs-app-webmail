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

describe('conjoon.cn_mail.model.mail.BaseModelTest', function(t) {

    t.requireOk('conjoon.cn_mail.model.mail.BaseModel', function() {

        Ext.define('conjoon.cn_mail.model.mail.BaseModelExtended', {
            extend     : 'conjoon.cn_mail.model.mail.BaseModel',
            idProperty : 'foo'
        });

        Ext.define('conjoon.cn_mail.model.mail.BaseModelExtendedNoId', {
            extend : 'conjoon.cn_mail.model.mail.BaseModel'
        });

        var model;


        t.afterEach(function() {
            model = null;
        });


// +----------------------------------------------------------------------------
// |                    =~. Unit Tests .~=
// +----------------------------------------------------------------------------

        t.it("Should not work without setting idProperty in subclass", function(t) {

            let exc, e;
            try{Ext.create('conjoon.cn_mail.model.mail.BaseModel');}catch(e){exc=e;}
            t.expect(exc).toBeDefined();
            t.expect(exc.msg).toBeDefined();
            t.expect(exc.msg.toLowerCase()).toContain("needs to be explicitly set");
            exc = undefined;

            try{Ext.create('conjoon.cn_mail.model.mail.BaseModel', {idProperty : 'foo'});}catch(e){exc=e;}
            t.expect(exc).toBeDefined();
            t.expect(exc.msg).toBeDefined();
            t.expect(exc.msg.toLowerCase()).toContain("needs to be explicitly set");
            exc = undefined;


            try{Ext.create('conjoon.cn_mail.model.mail.BaseModelExtendedNoId');}catch(e){exc=e;}
            t.expect(exc).toBeDefined();
            t.expect(exc.msg).toBeDefined();
            t.expect(exc.msg.toLowerCase()).toContain("needs to be explicitly set");
            exc = undefined;

            try{Ext.create('conjoon.cn_mail.model.mail.BaseModelExtendedNoId', {idProperty : 'foo'});}catch(e){exc=e;}
            t.expect(exc).toBeDefined();
            t.expect(exc.msg).toBeDefined();
            t.expect(exc.msg.toLowerCase()).toContain("needs to be explicitly set");
            exc = undefined;

        });


        t.it("constructor", function(t) {

            model = Ext.create('conjoon.cn_mail.model.mail.BaseModelExtended', {
                id : 1
            });

            t.expect(model instanceof coon.core.data.BaseModel).toBe(true);

            t.expect(model.getIdProperty()).toBe("foo");

        });


        t.it("Test Schema", function(t) {
            model = Ext.create('conjoon.cn_mail.model.mail.BaseModelExtended', {
                id : 1
            });

            t.expect(
                model.schema instanceof conjoon.cn_mail.data.mail.BaseSchema
            ).toBeTruthy();
        });



        t.it("Test Proxy", function(t) {

            t.expect(conjoon.cn_mail.model.mail.BaseModel.getProxy() instanceof Ext.data.proxy.Rest).toBe(true);
        });



    });


});
