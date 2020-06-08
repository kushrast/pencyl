package com.kushrastogi.pencyl;

import com.kushrastogi.pencyl.schema.PencylUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

/**
 * Controller for home page
 */
@Controller
public class HomeController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Direct requests for the home page towards the index template
     */
    @RequestMapping(value = {"", "/", "/view", "/review"})
    public ModelAndView index(@CookieValue(name = "userId", defaultValue = "") String userId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail, HttpServletResponse httpServletResponse) {
        if (userId == null || userId.equals("") || userEmail == null || userEmail.equals("")) {
            return new ModelAndView("redirect:/login");
        }

        ModelAndView mv = new ModelAndView();
        mv.setViewName("index");

        long id = Long.parseLong(userId);

        final Optional<PencylUser> currentUser = userRepository.findById(id);

        if (currentUser.isPresent()) {
            PencylUser user = currentUser.get();

            if (!user.getUserFlags().isFinishedSignOnTutorial()) {
                mv.getModel().put("showWelcomeTutorial", true);
            }
        } else {
            CookieUtils.clearUserCookies(httpServletResponse);
            return new ModelAndView("redirect:/login");
        }

        mv.getModel().put("userEmail", userEmail);
        mv.getModel().put("userId", userId);

        return mv;
    }

    /**
     * Direct requests for the login page to the login template unless already logged in.
     */
    @RequestMapping(value = {"/login"})
    public ModelAndView login(@CookieValue(name = "userId", defaultValue = "") String userId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {

        if (userId != null && !userId.equals("") && userEmail != null && !userEmail.equals("")) {
            return new ModelAndView("redirect:/");
        } else {
            ModelAndView mv = new ModelAndView();
            mv.setViewName("login");
            mv.getModel().put("GCS_CLIENT_ID", System.getenv("GCS_CLIENT_ID"));

            return mv;
        }
    }
}
