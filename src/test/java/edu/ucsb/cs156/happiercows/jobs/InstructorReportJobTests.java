package edu.ucsb.cs156.happiercows.jobs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.Report;
import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.services.ReportService;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class InstructorReportJobTests {

    @MockBean
    ReportService reportService;

    @MockBean
    CommonsRepository commonsRepository;

    @Test
    void test_log_output() throws Exception {

        // Arrange
         LocalDateTime startDate = LocalDateTime.parse("2021-03-05T15:50:10");
        LocalDateTime endDate = LocalDateTime.parse("3000-04-08T15:50:10");
        Commons commons= Commons.builder().id(17L).name("CS156").startingDate(startDate).lastDay(endDate).build();
        Report report = Report.builder().id(17L).build();
        
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);
      
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commons));      
        when(reportService.createReport(17L)).thenReturn(report);

        // Act
        InstructorReportJob instructorReportJob = new InstructorReportJob(reportService, commonsRepository);
        instructorReportJob.accept(ctx);

        // Assert

        verify(commonsRepository).findAll();
        verify(reportService).createReport(17L);
        
        String expected = """
            Starting instructor report...
            Starting Commons id=17 (CS156)...
            Report 17 for commons id=17 (CS156) finished.
            Instructor report done!""";

        assertEquals(expected, jobStarted.getLog());
    }

    @Test
    void before_start_date() throws Exception {

        // Arrange
        LocalDateTime startDate = LocalDateTime.parse("3000-03-05T15:50:10");
        LocalDateTime endDate = LocalDateTime.parse("3000-04-08T15:50:10");
        Commons commons= Commons.builder().id(17L).name("CS156").startingDate(startDate).lastDay(endDate).build();
        Report report = Report.builder().id(17L).build();
        
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);
      
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commons));      
        when(reportService.createReport(17L)).thenReturn(report);

        // Act
        InstructorReportJob instructorReportJob = new InstructorReportJob(reportService, commonsRepository);
        instructorReportJob.accept(ctx);

        // Assert

        // verify(commonsRepository).findAll();
        // verify(reportService).createReport(17L);
        
        String expected = """
            Starting instructor report...
            Game is not currently in progress, report will not be filed in this common.
            Instructor report done!""";

        assertEquals(expected, jobStarted.getLog());
    }


     @Test
    void after_end_date() throws Exception {

        // Arrange
        LocalDateTime startDate = LocalDateTime.parse("2020-03-05T15:50:10");
        LocalDateTime endDate = LocalDateTime.parse("2020-04-08T15:50:10");
        Commons commons= Commons.builder().id(17L).name("CS156").startingDate(startDate).lastDay(endDate).build();
        Report report = Report.builder().id(17L).build();
        
        Job jobStarted = Job.builder().build();
        JobContext ctx = new JobContext(null, jobStarted);
      
        when(commonsRepository.findAll()).thenReturn(Arrays.asList(commons));      
        when(reportService.createReport(17L)).thenReturn(report);

        // Act
        InstructorReportJob instructorReportJob = new InstructorReportJob(reportService, commonsRepository);
        instructorReportJob.accept(ctx);

        // Assert

        // verify(commonsRepository).findAll();
        // verify(reportService).createReport(17L);
        
        String expected = """
            Starting instructor report...
            Game is not currently in progress, report will not be filed in this common.
            Instructor report done!""";

        assertEquals(expected, jobStarted.getLog());
    }

    
}