package com.kushrastogi.pencyl.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller for home page
 */
@Controller
public class HomeController {
    /**
     * Direct requests for the home page towards the index template
     */
    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }

    /**
     * Direct requests for reviews towards home page as well
     */
    @RequestMapping(value = "/review")
    public String review() {
        return "index";
    }

    /**
     * Direct requests for view all page towards home page as well
     */
    @RequestMapping(value = "/view")
    public String view() {
        return "index";
    }
}
