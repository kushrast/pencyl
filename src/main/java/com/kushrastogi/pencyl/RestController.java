package com.kushrastogi.pencyl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.common.base.Strings;
import com.google.common.collect.ImmutableList;
import com.kushrastogi.pencyl.schema.PencylUser;
import com.kushrastogi.pencyl.schema.Thought;
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

    final long halfDayMs = 1000 * 60 * 10;

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

        final Long id = Long.parseLong(userId);
        final Optional<PencylUser> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            PencylUser user = optionalUser.get();

            if (!user.getUserFlags().isSeenReflectMode()) {
                response.put("showReviewTutorial", true);
                return ResponseEntity.ok(response);
            }

            if (currentTime - user.getUserFlags().getSuggestedReviewTimestamp() > halfDayMs) {
                for (Thought thought : allThoughts) {
                    if (thought.getUser_id() == Long.parseLong(userId) && thought.getCreation_timestamp_ms() + oneDayMs < currentTime && thought.getLast_reviewed_timestamp_ms() + oneDayMs < currentTime) {

                        user.getUserFlags().setSuggestedReviewTimestamp(currentTime);
                        userRepository.save(user);
                        response.put("showSuggestReviewScreen", true);
                        return ResponseEntity.ok(response);
                    }
                }
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

        long currentTime = new Date().getTime();
        if (id == -100) {
            Thought sampleThought = new Thought(Long.parseLong(userId), "Sample Note", "Review me!", currentTime, ImmutableList.of(), ImmutableList.of(), 4);
            sampleThought.setId(-100L);
            response.put("thought", sampleThought);
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

        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/v2/review", produces = "application/json")
    public ResponseEntity<Map<String, Object>> review(@CookieValue(name = "userId", defaultValue = "") String cookieUserId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail, @RequestParam(value = "reviewedThoughtId", required = false) String reviewedThoughtId) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (cookieUserId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }

        long userId = Long.parseLong(cookieUserId);
        long currentTime = new Date().getTime();
        Optional<PencylUser> optionalUser = userRepository.findById(userId);

        System.out.println("review thought: " + reviewedThoughtId);
        if (optionalUser.isPresent()) {
            PencylUser pencylUser = optionalUser.get();

            if (!Strings.isNullOrEmpty(reviewedThoughtId)) {
                Long reviewedThoughtIdL = Long.parseLong(reviewedThoughtId);
                Optional<Thought> reviewedThought = thoughtRepository.findById(reviewedThoughtIdL);
                if (reviewedThought.isPresent()) {
                    Thought thought = reviewedThought.get();

                    thought.setLast_reviewed_timestamp_ms(currentTime);

                    System.out.println(thought);
                    thoughtRepository.save(thought);
                }
            }


            if (!pencylUser.getUserFlags().isFinishedReviewTutorial()) {
                pencylUser.getUserFlags().setSeenReflectMode(true);

                userRepository.save(pencylUser);
                response.put("tutorial", true);
                response.put("thoughtId", ImmutableList.of(-100));
                return ResponseEntity.ok(response);
            }

            Iterable<Thought> allThoughts = thoughtRepository.findAll();
            List<Thought> userThoughts = new ArrayList<>();
            for (Thought thought : allThoughts) {
                if (thought.getUser_id() == userId) {
                    if (thought.getCreation_timestamp_ms() + oneDayMs < currentTime && thought.getLast_reviewed_timestamp_ms() + oneDayMs < currentTime) {
                        userThoughts.add(thought);
                    }
                }
            }

            if (userThoughts.size() == 0) {
                response.put("thoughtId", null);
                return ResponseEntity.ok(response);
            }

            Collections.shuffle(userThoughts);

            pencylUser.getUserFlags().setSeenReflectMode(true);
            userRepository.save(pencylUser);

            Thought thought = userThoughts.get(0);

            thought.setLast_seen_timestamp_ms(currentTime);
            thoughtRepository.save(thought);

            response.put("thoughtId", thought.getId());
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
                if (thought.getUser_id() == Long.parseLong(cookieUserId)) {
                    matchingThoughts.add(thought.getId());
                }
            }
        } else {
            for (Thought thought : allThoughts) {
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
        GoogleIdToken token = verifier.verify(idToken);
        if (token != null) {
            GoogleIdToken.Payload payload = token.getPayload();

            String userId = payload.getSubject();
            String email = payload.getEmail();

            response.put("userId", userId);
            response.put("userEmail", email);
            response.put("error", "");

            boolean newUser = true;

            PencylUser currentPencylUser = null;

            for (PencylUser pencylUser : userRepository.findAll()) {
                if (pencylUser.getGoogleSSOId().equals(userId)) {
                    currentPencylUser = pencylUser;
                    newUser = false;
                }
            }

            if (newUser) {
                currentPencylUser = userRepository.save(new PencylUser(userId, email));
            }


            Cookie cookie = new Cookie("userId", String.valueOf(currentPencylUser.getId()));
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
            response.put("error", "Invalid ID token.");
        }
        return response;
    }

    /**
     * Direct requests for logging out here
     */
    @PostMapping(value = "/v2/logout", produces = "application/json")
    public ResponseEntity logout(HttpServletResponse httpServletResponse) {
        CookieUtils.clearUserCookies(httpServletResponse);
        return ResponseEntity.ok().build();
    }

    /**
     * Set user flag for finished sign on tutorial to true
     */
    @PostMapping(value = "/v2/finishedSignOnTutorial", produces = "application/json")
    public ResponseEntity finishSignOnTutorial(@CookieValue(name = "userId", defaultValue = "") String cookieUserId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (cookieUserId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }

        long userId = Long.parseLong(cookieUserId);

        final Optional<PencylUser> currentUser = userRepository.findById(userId);

        if (currentUser.isPresent()) {
            PencylUser user = currentUser.get();

            PencylUser.UserFlags flags = user.getUserFlags();
            flags.setFinishedSignOnTutorial(true);
            user.setUserFlags(flags);

            userRepository.save(user);
        } else {
            response.put("error", "noUser");
        }

        return ResponseEntity.ok().build();
    }

    /**
     * Set user flag for finished review tutorial to true
     */
    @PostMapping(value = "/v2/finishReviewTutorial", produces = "application/json")
    public ResponseEntity finishReviewTutorial(@CookieValue(name = "userId", defaultValue = "") String cookieUserId, @CookieValue(name = "userEmail", defaultValue = "") String userEmail) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "");

        if (cookieUserId.equals("") || userEmail.equals("")) {
            response.put("error", "Not logged in.");
            return ResponseEntity.ok(response);
        }

        long userId = Long.parseLong(cookieUserId);

        final Optional<PencylUser> currentUser = userRepository.findById(userId);

        if (currentUser.isPresent()) {
            PencylUser user = currentUser.get();

            PencylUser.UserFlags flags = user.getUserFlags();
            flags.setFinishedReviewTutorial(true);
            user.setUserFlags(flags);

            userRepository.save(user);
        } else {
            response.put("error", "noUser");
        }

        return ResponseEntity.ok().build();
    }
}
