export class Cookie {
    static setCookie(key: string, value: any, time: number) {
        /**
         * time:秒 非必要
         */

        let expires = "";
        if (time != null) {
            let d = new Date();
            d.setTime(d.getTime() + (time * 1000));
            expires = "expires=" + d.toUTCString()
        }
        document.cookie = key + "=" + encodeURIComponent(value) + "; " + expires;
    }
    static getCookie(key: string) : any {
        let name = key + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return null;
    }
    static getAllCookie() : object {
        /**
         * readOnly
         */
        let ca = document.cookie.split(';');
        let result = {}
        if (ca[0].indexOf("=") >= 0) {
            for (let i in ca) {
                let eachcookie = ca[i].split("=");
                result[eachcookie[0]] = decodeURIComponent(eachcookie[1])
            }
        }
        return result;
    }
    static removeCookie(key: string) {
        Cookie.setCookie(key, null, -1);
    }
    static removeAllCookies() {
        let all = Cookie.getAllCookie()
        let keys = Object.keys(all)
        for (let keyIndex in keys) {
            let key = keys[keyIndex]
            Cookie.removeCookie(key)
        }
    }
}