/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "UserPoses")
@PrimaryKeyJoinColumn(name = "UserPoseId")
public class UserPose extends Pose {

    private User user;
    private Pose overridenPose;

    public UserPose() {
        super();
    }

    public UserPose(String title, Pose overridenPose, User user) {
        super(title);
        this.overridenPose = overridenPose;
        this.user = user;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OverridenPoseId", unique = true, nullable = false, insertable = false, updatable = false)
    public Pose getOverridenPose() {
        return this.overridenPose;
    }

    public void setOverridenPose(Pose overridenPose) {
        this.propertyChanged.firePropertyChange("overridenPose", this.overridenPose, this.overridenPose = overridenPose);
    }

    @ManyToOne(optional=false, fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", nullable = false)
    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.propertyChanged.firePropertyChange("user", this.user, this.user = user);
    }
}
