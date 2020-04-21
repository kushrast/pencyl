package com.kushrastogi.thoughtbank;

import com.kushrastogi.thoughtbank.schema.Thought;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * Loads database
 */
@Component
public class DatabaseLoader implements CommandLineRunner {

    private final ThoughtRepository repository;

    @Autowired
    public DatabaseLoader(ThoughtRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception {
        final long currentTime = new Date().getTime();
        this.repository.save(
                new Thought("Big thought", "Big content", currentTime, 0)
        );
    }
}
