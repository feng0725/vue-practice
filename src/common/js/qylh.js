function strIsObj(str) {
    if (!str) return false;
    let firstStr = str.substring(0, 1);
    return firstStr === '{' || firstStr === '[';
}
let Cookies = {
    getItem: function(sKey) {
        if (!sKey) {
            return null;
        }
        return (
            decodeURIComponent(
                document.cookie.replace(
                    new RegExp(
                        '(?:(?:^|.*;)\\s*' +
                            encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') +
                            '\\s*\\=\\s*([^;]*).*$)|^.*$'
                    ),
                    '$1'
                )
            ) || null
        );
    },
    setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = '';
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
                    break;
                case String:
                    sExpires = '; expires=' + vEnd;
                    break;
                case Date:
                    sExpires = '; expires=' + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie =
            encodeURIComponent(sKey) +
            '=' +
            encodeURIComponent(sValue) +
            sExpires +
            (sDomain ? '; domain=' + sDomain : '') +
            (sPath ? '; path=' + sPath : '') +
            (bSecure ? '; secure' : '');
        return true;
    },
    removeItem: function(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie =
            encodeURIComponent(sKey) +
            '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
            (sDomain ? '; domain=' + sDomain : '') +
            (sPath ? '; path=' + sPath : '');
        return true;
    },
    hasItem: function(sKey) {
        if (!sKey) {
            return false;
        }
        return new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=').test(
            document.cookie
        );
    },
    keys: function() {
        var aKeys = document.cookie
            .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
            .split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};
let session = {
    get(name) {
        let item = sessionStorage.getItem(name);
        if (item == null || item == 'null') {
            item = '';
        }
        if (strIsObj(item)) {
            return JSON.parse(item);
        } else {
            return item;
        }
    },
    set(name, val) {
        if (typeof val === 'object') {
            val = JSON.stringify(val);
        }
        sessionStorage.setItem(name, val);
    },
    remove(name) {
        sessionStorage.removeItem(name);
    },
    clear() {
        sessionStorage.clear();
    }
};
let storage = {
    get(name) {
        let item = localStorage.getItem(name);
        if (item == null || item == 'null') {
            item = '';
        }
        if (strIsObj(item)) {
            return JSON.parse(item);
        } else {
            return item;
        }
    },
    set(name, val) {
        if (typeof val === 'object') {
            val = JSON.stringify(val);
        }
        localStorage.setItem(name, val);
    },
    clear() {
        localStorage.clear();
    },
    remove(name) {
        localStorage.removeItem(name);
    }
};
let tools = {
    defaultAll: -2,
    toDouble(val) {
        return val < 10 ? '0' + val : val;
    },
    rnd(n, m) {
        return Math.round(Math.random() * (m - n)) + n;
    },
    rndArr(n, m, length) {
        var arr = [];
        for (var i = 0; i < length; i++) {
            arr.push(this.rnd(n, m));
        }
        return arr;
    },
    cloneObj(obj = {}, defaults = null) {
        for (let key in obj) {
            if (obj[key] == undefined) {
                obj[key] = defaults;
            }
        }
        return JSON.parse(JSON.stringify(obj));
    },
    filterFileNmae(fileName) {
        let name = fileName.replace(/\s*/g, '').replace(/(\?| \*|:|"|<|>|\\|\/|\|)/g, '');
        let arr = name.split('.');
        if (arr.length == 3) {
            arr.splice(1, 1);
        }
        return arr.join('.');
    }
};

/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fn, t) => {
    let delay = t || 500;
    let timer;
    console.log(fn);
    console.log(typeof fn);
    return function() {
        let args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    };
};
/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
export const Throttle = (fn, interval = 500) => {
    let last;
    let timer;
    return function() {
        let args = arguments;
        let now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, interval);
        } else {
            last = now;
            fn.apply(this, args);
        }
    };
};
export { session, tools, storage, Cookies };
