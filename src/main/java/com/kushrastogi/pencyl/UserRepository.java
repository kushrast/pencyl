package com.kushrastogi.pencyl;

import com.kushrastogi.pencyl.schema.User;
import org.springframework.data.repository.CrudRepository;

/**
 * Database connector. Currently using in-memory datastore
 *
 * TODO: Switch to MongoDB or Postgres
 */
public interface UserRepository extends CrudRepository<User, Long> {

}