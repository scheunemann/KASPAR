package runners;

import data.Action;
import data.Robot;
import gui.GuiLogger;
import java.util.Collection;
import java.util.HashSet;
import java.util.logging.Level;

public class ParallelRunner {

    private Robot robot;

    public ParallelRunner(Robot robot) {
        this.robot = robot;
    }

    public void execute(Collection<Action> sequence) {
        Collection<Thread> threads = new HashSet<Thread>();
        for (Action action : sequence) {
            RunAction ra = new RunAction(robot, action);
            Thread t = new Thread(ra);
            threads.add(t);
            t.start();
        }
        
        for(Thread t: threads) {
            try {
                t.join();
            } catch (InterruptedException ex) {
                GuiLogger.getLogger().log(Level.SEVERE, null, ex);
            }
        }
    }

    private class RunAction implements Runnable {

        private Action action;
        private Robot robot;

        public RunAction(Robot robot, Action action) {
            this.action = action;
            this.robot = robot;
        }

        @Override
        public void run() {
            ActionRunner ar = new ActionRunner(this.robot);
            ar.execute(this.action);
        }
    }
}
