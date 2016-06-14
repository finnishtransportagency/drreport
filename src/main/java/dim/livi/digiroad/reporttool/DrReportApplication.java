package dim.livi.digiroad.reporttool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

import dim.livi.digiroad.NisRepository;

//@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan(basePackageClasses={NisRepository.class})
@EnableScheduling
public class DrReportApplication {

	public static void main(String[] args) {
		SpringApplication.run(DrReportApplication.class, args);
	}
}
