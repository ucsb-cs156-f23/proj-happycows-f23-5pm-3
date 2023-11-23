package edu.ucsb.cs156.happiercows.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import edu.ucsb.cs156.happiercows.entities.User;
import org.junit.jupiter.api.Test;

import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.time.LocalDateTime;

public class CommonsTest {

    LocalDateTime s1 = LocalDateTime.parse("2012-01-10T15:50:10");
    LocalDateTime s2 = LocalDateTime.parse("2024-01-10T15:50:10");
    LocalDateTime e1 = LocalDateTime.parse("2030-01-10T15:50:10");
    LocalDateTime e2 = LocalDateTime.parse("2023-01-10T15:50:10");
    
    @Test
    void test_gameInProgressTrue() throws Exception {
        assertEquals(true, Commons.builder().startingDate(s1).lastDay(e1).build().gameInProgress());
    }
    @Test
    void test_gameInProgress_False_Not_Started() throws Exception {
        assertEquals(false, Commons.builder().startingDate(s2).lastDay(e1).build().gameInProgress());
    }
    @Test
    void test_gameInProgress_False_Already_Ended() throws Exception {
        assertEquals(false, Commons.builder().startingDate(s1).lastDay(e2).build().gameInProgress());
    }
}
