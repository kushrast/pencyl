package com.kushrastogi.pencyl;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

public class CookieUtils {
    public static void clearUserCookies(HttpServletResponse httpServletResponse) {
        Cookie cookie = new Cookie("userId", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);

        httpServletResponse.addCookie(cookie);

        cookie = new Cookie("userEmail", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);

        httpServletResponse.addCookie(cookie);
    }
}
