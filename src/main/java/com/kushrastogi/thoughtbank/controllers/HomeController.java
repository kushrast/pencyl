package com.kushrastogi.thoughtbank.controllers;

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
}
