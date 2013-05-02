/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "ServoPositions")
public class ServoPosition implements java.io.Serializable {

    private Integer speed; //Abstract speed
    private Integer position; //Abstract (Degrees/Radians?)
    private String servoName;
    private Pose pose;
    private Integer servoPositionId;
    private Boolean waitForComplete;
    protected PropertyChangeSupport propertyChanged;

    public ServoPosition() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public ServoPosition(String servoName, Integer position, Integer speed, Boolean waitForComplete) {
        this();
        this.servoName = servoName;
        this.position = position;
        this.speed = speed;
        this.waitForComplete = waitForComplete;
    }
    
    @Override
    public String toString() {
        return String.format("{0}: {1}@{2}", this.getServoName(), this.getPosition(), this.getSpeed());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServoPositionId", unique = true, nullable = false)
    public int getServoPositionId() {
        return this.servoPositionId;
    }

    public void setServoPositionId(int servoPositionId) {
        this.propertyChanged.firePropertyChange("servoPositionId", this.servoPositionId, this.servoPositionId = servoPositionId);
    }

    @Column(name = "Position", nullable = false)
    public Integer getPosition() {
        return this.position;
    }

    public void setPosition(Integer position) {
        this.propertyChanged.firePropertyChange("position", this.position, this.position = position);
    }

    @Column(name = "ServoName", nullable = false)
    public String getServoName() {
        return this.servoName;
    }

    public void setServoName(String servoName) {
        this.propertyChanged.firePropertyChange("servoName", this.servoName, this.servoName = servoName);
    }
    
    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "PoseId", nullable = false)
    public Pose getPose() {
        return this.pose;
    }

    public void setPose(Pose pose) {
        this.propertyChanged.firePropertyChange("pose", this.pose, this.pose = pose);
    }

    @Column(name = "Speed", nullable = false)
    public Integer getSpeed() {
        return this.speed;
    }

    public void setSpeed(Integer speed) {
        this.propertyChanged.firePropertyChange("speed", this.speed, this.speed = speed);
    }

    @Column(name = "WaitForComplete", nullable = false)
    public Boolean getWaitForComplete() {
        return this.waitForComplete;
    }

    public void setWaitForComplete(Boolean waitFor) {
        this.propertyChanged.firePropertyChange("waitForComplete", this.waitForComplete, this.waitForComplete = waitFor);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
