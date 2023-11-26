package edu.ucsb.cs156.happiercows.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "announcement")
public class Announcement {
    
    // Unique Message Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // The commons that the announcement is for
    private long commonsId;

    // The starting datetime to begin showing the announcement and the optional ending datetime to stop showing the announcement
    private LocalDateTime startingDate;
    private LocalDateTime endingDate;

    // The contents of the announcement itself
    private String announcement;
}
