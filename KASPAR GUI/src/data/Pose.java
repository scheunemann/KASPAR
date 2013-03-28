/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "Poses")
@PrimaryKeyJoinColumn(name="PoseId")
public class Pose extends Action {

    private Set<UserPose> userPoses = new HashSet<UserPose>(0);
    private Set<ServoPosition> servoPositions = new HashSet<ServoPosition>(0);

    public Pose() {
        super();
    }

    public Pose(String title) {
        super(title);
    }

    public Pose(String title, Set<UserPose> userPoses) {
        this(title);
        this.userPoses = userPoses;
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="overridenPose")
    public Set<UserPose> getUserPoses() {
        return this.userPoses;
    }

    public void setUserPoses(Set<UserPose> userPoses) {
        this.propertyChanged.firePropertyChange("userPoses", this.userPoses, this.userPoses = userPoses);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="pose")
    public Set<ServoPosition> getServoPositions() {
        return this.servoPositions;
    }

    public void setServoPositions(Set<ServoPosition> servoPositions) {
        this.propertyChanged.firePropertyChange("servoPositions", this.servoPositions, this.servoPositions = servoPositions);
    }
}
