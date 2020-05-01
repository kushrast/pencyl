package com.kushrastogi.pencyl;

import com.kushrastogi.pencyl.schema.Thought;
import org.springframework.data.repository.CrudRepository;

/**
 * Database connector. Currently using in-memory datastore
 *
 * TODO: Switch to MongoDB or Postgres
 */
public interface ThoughtRepository extends CrudRepository<Thought, Long> {

}
