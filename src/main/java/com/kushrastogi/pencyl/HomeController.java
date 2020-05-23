package com.kushrastogi.pencyl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Controller for home page
 */
@Controller
public class HomeController {

    /**
     * Direct requests for the home page towards the index template
     */
    @RequestMapping(value={"", "/", "/view", "/review", "/login"})
    public ModelAndView index(@CookieValue(name="userId", defaultValue = "") String userId, @CookieValue(name="userEmail", defaultValue = "") String userEmail) {
        System.out.println("hoho");
        System.out.println("userEmail: " + userEmail);
        ModelAndView mv = new ModelAndView();
        mv.setViewName("index");

        mv.getModel().put("userEmail", userEmail);
        mv.getModel().put("userId", userId);
        mv.getModel().put("GCS_CLIENT_ID", System.getenv("GCS_CLIENT_ID"));

        return mv;
    }
}
