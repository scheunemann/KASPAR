/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package runners;

import data.Pose;
import data.Robot;
import data.ServoPosition;

public class PoseRunner {
    
    private Robot robot;
    
    public PoseRunner(Robot robot) {
        this.robot = robot;
    }

    public void execute(Pose pose) {

        ServoRunner sr = new ServoRunner(this.robot);
        // in case of SSC32 or MiniSSC servos - initiate movement
        for (ServoPosition sPos : pose.getServoPositions()) {
            sr.prepare(sPos);
        }
        
        sr.runPrepared();        
    }

    /**
     * Query whether the pose is valid and can be executed. A pose is valid if
     * it was loaded completely from the file
     *
     * @return true if pose is valid, false otherwise
     */
    public boolean isValid(Pose pose) {
        return !pose.getServoPositions().isEmpty();
    }
}
