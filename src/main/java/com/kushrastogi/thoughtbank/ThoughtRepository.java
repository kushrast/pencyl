package com.kushrastogi.thoughtbank;

import com.kushrastogi.thoughtbank.schema.Thought;
import org.springframework.data.repository.CrudRepository;

/**
 * Database connector. Currently using in-memory datastore
 *
 * TODO: Switch to MongoDB or Postgres
 */
public interface ThoughtRepository extends CrudRepository<Thought, Long> {

}
