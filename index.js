'use strict';

const crypto = require('crypto');

module.exports = Cookies;

function Cookies(secret) {

    return async (ctx, next) => {
        if (ctx.cookies === undefined)
            ctx.cookies = new _Cookies(ctx.req, ctx.res, secret);

        await next();
    };
}

class _Cookies {
    constructor(req, res, secret) {
        this.req = req;
        this.res = res;
        this.secret = secret;

        this.parsed = undefined;

        this.headers = [];
        this.res.setHeader('Set-Cookie', this.headers);
    }

    get(name) {
        if (this.parsed === undefined) {
            this.parsed = {};

            const header = this.req.headers['cookie'];
            if (header !== undefined) {

                const cookies = header.split('; ');
                for (const cookie of cookies) {
                    const pos = cookie.indexOf('=');
                    const name = cookie.slice(0, pos);

                    let value = cookie.slice(pos + 1);
                    if (this.secret)
                        value = unsignCookie(value, this.secret);
                    if (value !== false)
                        this.parsed[name] = value;
                }
            }
        }

        return this.parsed[name];
    }

    set(name, value, attrs = default_attrs) {
        if (this.res.headersSent)
            throw new Error();

        if (this.secret)
            value = signCookie(value, this.secret);

        this.headers.push(new _Cookie(name, value, attrs));
    }
}

const default_attrs = {
    expires: undefined, max_age: undefined,
    domain: undefined, path: undefined,
    secure: false, httponly: false,
};

class _Cookie {
    constructor(name, value, attrs = default_attrs) {
        this.name = name;
        this.value = value;
        this.attrs = attrs;
    }

    toString() {
        let header = this.name + '=' + this.value;

        const attrs = this.attrs;
        if (attrs.expires) header += '; expires=' + attrs.expires;
        if (attrs.max_age) header += '; max-age=' + attrs.max_age;
        if (attrs.domain) header += '; domain=' + attrs.domain;
        if (attrs.path) header += '; path=' + attrs.path;
        if (attrs.secure) header += '; secure';
        if (attrs.httponly) header += '; httponly';

        return header;
    }
}

function sign(value, secret) {
    return crypto.createHmac('sha256', secret).update(value).digest('base64').replace(/\=+$/, '');
}

function signCookie(value, secret) {
    return value + '|' + sign(value, secret);
}

function unsignCookie(signedValue, secret) {

    const pos = signedValue.lastIndexOf('|');
    if (pos === -1)
        return false;

    const value = signedValue.slice(0, pos);
    const signature = signedValue.slice(pos + 1);

    if (sign(value) !== signature)
        return false;

    return value;
}
