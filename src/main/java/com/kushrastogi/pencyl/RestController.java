package com.kushrastogi.pencyl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.kushrastogi.pencyl.schema.Thought;
import com.kushrastogi.pencyl.schema.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    private static final JacksonFactory jacksonFactory = new JacksonFactory();
    //    final long oneDayMs = 1000 * 60 * 60 * 24;
    final long oneDayMs = 1000 * 20;

    @Autowired
    private ThoughtRepository thoughtRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(value = "/v2/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Map<String, Object>> save(@RequestBody Thought newThought, @CookieValue(name = "userId", defaultValue = "") String userId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (userId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }
        newThought.setUser_id(Long.parseLong(userId));

        final long currentTime = new Date().getTime();
        newThought.setCreation_timestamp_ms(currentTime);
        newThought.setLast_edited_timestamp_ms(currentTime);
        newThought.setLast_reviewed_timestamp_ms(currentTime);

        thoughtRepository.save(newThought);
        Iterable<Thought> allThoughts = thoughtRepository.findAll();

        for (Thought thought : allThoughts) {
            if (thought.getUser_id() == Long.parseLong(userId) && thought.getCreation_timestamp_ms() + oneDayMs < currentTime && thought.getLast_reviewed_timestamp_ms() + oneDayMs < currentTime) {
                response.put("showSuggestReviewScreen", true);
                return ResponseEntity.ok(response);
            }
        }

        response.put("showSuggestReviewScreen", false);
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/v2/update", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> update(@RequestBody Thought updatedThought, @CookieValue(name = "userId", defaultValue = "") String userId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (userId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }

        final long currentTime = new Date().getTime();
        updatedThought.setLast_edited_timestamp_ms(currentTime);

        Optional<Thought> optionalThought = thoughtRepository.findById(updatedThought.getId());

        if (optionalThought.isPresent()) {
            Thought currentThought = optionalThought.get();
            currentThought.updateFrom(updatedThought);

            thoughtRepository.save(currentThought);

            response.put("currentTime", currentTime);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/v2/get", produces = "application/json")
    public ResponseEntity<Map<String, Object>> get(@RequestParam(name = "id") long id, @CookieValue(name = "userId", defaultValue = "") String userId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (userId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }

        Optional<Thought> thought = thoughtRepository.findById(id);

        if (thought.isPresent()) {
            response.put("thought", thought.get());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(value = "/v2/delete", produces = "application/json")
    public ResponseEntity<Map<String, Object>> delete(@RequestParam(name = "id") long id, @CookieValue(name = "userId", defaultValue = "") String userId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (userId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }

        thoughtRepository.deleteById(id);

        final Optional<User> optionalUser = userRepository.findById(Long.parseLong(userId));

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            List<Long> thoughtsInReview = new ArrayList<>(user.getThoughtsInReview());
            thoughtsInReview.remove(id);

            user.setThoughtsInReview(thoughtsInReview);

            userRepository.save(user);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/v2/review", produces = "application/json")
    public ResponseEntity<Map<String, Object>> review(@CookieValue(name = "userId", defaultValue = "") String cookieUserId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (cookieUserId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }

        System.out.println("Review for: " + cookieUserId);

        long userId = Long.parseLong(cookieUserId);
        long currentTime = new Date().getTime();
        Optional<User> optionalUser = userRepository.findById(userId);

        System.out.println(optionalUser);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            System.out.println(user);

            if (!user.getThoughtsInReview().isEmpty()) {
                System.out.println(user.getThoughtsInReview());
                response.put("thoughtsInReview", user.getThoughtsInReview());
                return ResponseEntity.ok(response);
            } else {
                Iterable<Thought> allThoughts = thoughtRepository.findAll();
                List<Long> userThoughts = new ArrayList<>();
                List<Long> thoughtsToReview = new ArrayList<>();

                for (Thought thought : allThoughts) {
                    System.out.println(thought);
                    System.out.println(userId);
                    if (thought.getUser_id() == userId) {
                        if (thought.getCreation_timestamp_ms() + oneDayMs < currentTime && thought.getLast_reviewed_timestamp_ms() + oneDayMs < currentTime) {
                            userThoughts.add(thought.getId());
                        }
                    }
                }

                Collections.shuffle(userThoughts);

                for (int i = 0; i < 3 && i < userThoughts.size(); i++) {
                    thoughtsToReview.add(userThoughts.get(i));
                }

                user.setThoughtsInReview(thoughtsToReview);
                userRepository.save(user);

                response.put("thoughtsInReview", thoughtsToReview);
                return ResponseEntity.ok(response);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(value = "/v2/finishReview")
    public ResponseEntity<Map<String, Object>> finishReview(@CookieValue(name = "userId", defaultValue = "") String cookieUserId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (cookieUserId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }

        long userId = Long.parseLong(cookieUserId);

        long currentTimeMs = new Date().getTime();

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            for (long thoughtId : user.getThoughtsInReview()) {
                Optional<Thought> optionalThought = thoughtRepository.findById(thoughtId);

                if (optionalThought.isPresent()) {
                    Thought thought = optionalThought.get();

                    thought.setLast_reviewed_timestamp_ms(currentTimeMs);

                    thoughtRepository.save(thought);
                } else {
                    //TODO: Do something else about this
                    System.out.println("Thought no longer exists");
                }
            }

            user.setThoughtsInReview(new ArrayList<>());
            userRepository.save(user);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/v2/search", produces = "application/json")
    public ResponseEntity<Map<String, Object>> search(@RequestParam(name = "tag", required = false, defaultValue = "") List<String> tagCriteria, @RequestParam(name = "regular", required = false, defaultValue = "") List<String> regularCriteria, @CookieValue(name = "userId", defaultValue = "") String cookieUserId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (cookieUserId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }

        Iterable<Thought> allThoughts = thoughtRepository.findAll();
        List<Long> matchingThoughts = new ArrayList();

        if (tagCriteria.isEmpty() && regularCriteria.isEmpty()) {
            for (Thought thought : allThoughts) {
                System.out.println(thought);
                System.out.println(cookieUserId);
                if (thought.getUser_id() == Long.parseLong(cookieUserId)) {
                    matchingThoughts.add(thought.getId());
                }
            }
        } else {
            for (Thought thought : allThoughts) {
                System.out.println(thought);
                System.out.println(cookieUserId);
                if (thought.getUser_id() != Long.parseLong(cookieUserId)) {
                    continue;
                }
                boolean thoughtMatches = false;
                criteriaLoop:
                for (String tagVal : tagCriteria) {
                    for (Thought.Tag tag : thought.getTags()) {
                        if (tag.getTag_content().equals(tagVal)) {
                            thoughtMatches = true;
                            break criteriaLoop;
                        }
                    }
                }

                if (!thoughtMatches) {
                    for (String regularVal : regularCriteria) {
                        if (thought.getTitle().contains(regularVal) || thought.getContent().contains(regularVal)) {
                            thoughtMatches = true;
                            break;
                        }
                    }
                }

                if (thoughtMatches) {
                    matchingThoughts.add(thought.getId());
                }
            }
        }

        response.put("thoughts", matchingThoughts);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/v2/authenticate", produces = "application/json")
    public Map<String, String> authenticate(@RequestBody String idToken, HttpServletResponse httpServlet) throws GeneralSecurityException, IOException {
        Map<String, String> response = new HashMap<>();
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(GoogleNetHttpTransport.newTrustedTransport(), jacksonFactory)
                // Specify the CLIENT_ID of the app that accesses the backend:
//                .setAudience(Collections.singletonList(System.getenv("GCS_CLIENT_ID")))
                .setAudience(Collections.singletonList("27381813571-r33bvi2ktlka5u13fufoa043s29kf3c7.apps.googleusercontent.com"))
                // Or, if multiple clients access the backend:
                //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
                .build();

//        System.out.println(System.getenv("GCS_CLIENT_ID"));
        System.out.println(idToken);
        GoogleIdToken token = verifier.verify(idToken);
        if (token != null) {
            GoogleIdToken.Payload payload = token.getPayload();

            String userId = payload.getSubject();
            String email = payload.getEmail();
            System.out.println(userId + " " + email);

            response.put("userId", userId);
            response.put("userEmail", email);
            response.put("error", "");

            boolean newUser = true;

            User currentUser = null;

            for (User user : userRepository.findAll()) {
                System.out.println(user);
                if (user.getGoogleSSOId().equals(userId)) {
                    System.out.println("Found user :" + user.toString());
                    currentUser = user;
                    newUser = false;
                }
            }

            if (newUser) {
                System.out.println("Making new user");
                currentUser = userRepository.save(new User(userId, email));
            }


            Cookie cookie = new Cookie("userId", String.valueOf(currentUser.getId()));
            cookie.setPath("/");
//            cookie.setSecure(true);
            cookie.setHttpOnly(true);

            httpServlet.addCookie(cookie);

            cookie = new Cookie("userEmail", email);
            cookie.setPath("/");
//            cookie.setSecure(true);
            cookie.setHttpOnly(true);

            httpServlet.addCookie(cookie);
        } else {
            System.out.println("Invalid ID token");
            response.put("error", "Invalid ID token.");
        }
        return response;
    }

    /**
     * Direct requests for logging out here
     */
    @PostMapping(value = "/v2/logout", produces = "application/json")
    public ResponseEntity logout(HttpServletResponse httpServletResponse) {
        System.out.println("yo");
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

        return ResponseEntity.ok().build();
    }
}
