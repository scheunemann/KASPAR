package runners;

import data.Action;
import data.Robot;
import data.Sequence;
import data.SequenceAction;
import gui.GuiLogger;
import java.util.Collection;
import java.util.HashSet;
import java.util.logging.Level;

public class SequenceRunner {

    private Robot robot;

    public SequenceRunner(Robot robot) {
        this.robot = robot;
    }

    public void execute(Sequence sequence) {
        if (sequence.isParallelable()) {
            ParallelRunner pr = new ParallelRunner(robot);
            Collection<Action> actions = new HashSet<Action>();
            for (SequenceAction action : sequence.getSequenceActions()) {
                actions.add(action.getAction());
            }

            pr.execute(actions);
        } else {
            ActionRunner ar = new ActionRunner(robot);
            for (SequenceAction action : sequence.getSequenceActions()) {
                ar.execute(action.getAction());

                try {
                    Thread.sleep(action.getWaitAfter());
                } catch (InterruptedException ex) {
                    GuiLogger.getLogger().log(Level.SEVERE, null, ex);
                    return;
                }
            }
        }
    }
}
