'use strict';

module.exports = Cookies;

function Cookies() {

    return async (ctx, next) => {
        if (ctx.cookies === undefined)
            ctx.cookies = new _Cookies(ctx.req, ctx.res);

        await next();
    };
}

class _Cookies {
    constructor(req, res) {
        this.req = req;
        this.res = res;

        this.parsed = undefined;

        this.headers = [];
        this.res.setHeader('Set-Cookie', this.headers);
    }

    get(name) {
        if (this.parsed === undefined) {
            this.parsed = {};

            const header = this.req.headers['cookie'];
            if (header !== undefined) {

                const cookies = header.split(';');
                for (const cookie of cookies) {
                    const pos = cookie.indexOf('=');
                    const name = cookie.slice(0, pos);
                    const value = cookie.slice(pos + 1);

                    this.parsed[name] = value;
                }
            }
        }

        return this.parsed[name];
    }

    set(name, value, attrs = default_attrs) {
        if (this.res.headersSent)
            throw new Error();
        this.headers.push(new _Cookie(name, value, attrs));
    }
}

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

var default_attrs = {
    expires: undefined, max_age: undefined,
    domain: undefined, path: undefined,
    secure: false, httponly: false,
};
