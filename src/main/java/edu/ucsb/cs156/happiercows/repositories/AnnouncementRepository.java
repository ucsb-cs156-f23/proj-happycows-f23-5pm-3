package edu.ucsb.cs156.happiercows.repositories;

import org.springframework.data.repository.CrudRepository;

import edu.ucsb.cs156.happiercows.entities.Announcement;

public interface AnnouncementRepository extends CrudRepository<Announcement, Long> {
    
}
