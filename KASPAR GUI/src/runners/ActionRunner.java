/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package runners;

import data.Action;
import data.Pose;
import data.Robot;
import data.Sequence;
import data.Sound;
import gui.GuiLogger;
import java.util.logging.Level;

/**
 *
 * @author nathan
 */
public class ActionRunner {
    
    private Robot robot;
    
    public ActionRunner(Robot robot)
    {
        this.robot = robot;
    }

    public static boolean isValid(Action action) {
        //TODO: check for valid
        return action != null;
    }

    public void execute(Action action) {
        if (action instanceof Sequence) {
            new SequenceRunner(this.robot).execute((Sequence)action);
        } else if (action instanceof Pose) {
            new PoseRunner(this.robot).execute((Pose)action);
        } else if (action instanceof Sound) {
            new SoundRunner(this.robot).execute((Sound)action);
        } else {
            GuiLogger.getLogger().log(Level.SEVERE, "Could not determine action type for " + action.toString(), action);
        }
    }
}
