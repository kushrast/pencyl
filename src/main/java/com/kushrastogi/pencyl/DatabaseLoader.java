package com.kushrastogi.pencyl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Loads database
 */
@Component
public class DatabaseLoader implements CommandLineRunner {

    private final ThoughtRepository thoughtRepository;
    private final UserRepository userRepository;

    @Autowired
    public DatabaseLoader(
            ThoughtRepository thoughtRepository,
            UserRepository userRepository) {
        this.thoughtRepository = thoughtRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
    }
}
