package dim.livi.digiroad.reporttool;


import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Component;
import java.util.concurrent.Future;

@Component
public class MailSender {

    @Async
    public Future<Boolean> sendMail() throws InterruptedException {
        System.out.println("future start: " + ScheduleTask.getCurrentTimer());
        Thread.sleep(5000L);
        System.out.println("future ready: " + ScheduleTask.getCurrentTimer());
        return new AsyncResult<Boolean>(true);
    }
}
