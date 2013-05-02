/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "Robots")
public class Robot implements java.io.Serializable {

    private Integer robotId;
    private String version;
    private String name;
    private Set<ServoConfig> servoConfigs = new HashSet<ServoConfig>(0);
    private Set<Interaction> interactions = new HashSet<Interaction>(0);
    private Set<ServoGroup> servoGroups = new HashSet<ServoGroup>(0);
    private Pose resetPose;
    protected PropertyChangeSupport propertyChanged;

    public Robot() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public Robot(String name) {
        this();
        this.name = name;
    }

    public Robot(String name, Pose resetPose, Set<ServoConfig> servoConfigs, Set<Interaction> interactions, Set<ServoGroup> servoGroups) {
        this(name);
        this.resetPose = resetPose;
        this.servoConfigs = servoConfigs;
        this.interactions = interactions;
        this.servoGroups = servoGroups;
    }
    
    @Override
    public String toString() {
        return String.format("{0} v{1}", this.getName(), this.getVersion());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RobotId", unique = true, nullable = false)
    public Integer getRobotId() {
        return this.robotId;
    }

    public void setRobotId(Integer robotId) {
        this.propertyChanged.firePropertyChange("robotId", this.robotId, this.robotId = robotId);
    }

    @Column(name = "Version", length = 30)
    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.propertyChanged.firePropertyChange("version", this.version, this.version = version);
    }

    @Column(name = "Name", nullable = false, length = 30)
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.propertyChanged.firePropertyChange("name", this.name, this.name = name);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="robot")
    public Set<ServoConfig> getServoConfigs() {
        return this.servoConfigs;
    }

    public void setServoConfigs(Set<ServoConfig> servoConfigs) {
        this.propertyChanged.firePropertyChange("servoConfigs", this.servoConfigs, this.servoConfigs = servoConfigs);
    }

    @ManyToMany(fetch = FetchType.LAZY, mappedBy="robots")
    public Set<Interaction> getInteractions() {
        return this.interactions;
    }

    public void setInteractions(Set<Interaction> interactions) {
        this.propertyChanged.firePropertyChange("interactions", this.interactions, this.interactions = interactions);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="robot")
    public Set<ServoGroup> getServoGroups() {
        return this.servoGroups;
    }

    public void setServoGroups(Set<ServoGroup> servoGroups) {
        this.propertyChanged.firePropertyChange("servoGroups", this.servoGroups, this.servoGroups = servoGroups);
    }

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "ResetPoseId", nullable = true)
    public Pose getResetPose() {
        return this.resetPose;
    }

    public void setResetPose(Pose resetPose) {
        this.propertyChanged.firePropertyChange("resetPose", this.resetPose, this.resetPose = resetPose);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
