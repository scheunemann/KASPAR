/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "ServoGroups")
public class ServoGroup implements java.io.Serializable {

    private String title;
    private List<Servo> servos;
    private Integer servoGroupId;
    private Robot robot;
    private Integer locationX;
    private Integer locationY;
    protected PropertyChangeSupport propertyChanged;

    public ServoGroup() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public ServoGroup(Robot robot, Integer locationX, Integer locationY, String title) {
        this();
        this.robot = robot;
        this.title = title;
        this.locationX = locationX;
        this.locationY = locationY;
    }
    
    @Override
    public String toString() {
        return this.getTitle();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServoGroupId", unique = true, nullable = false)
    public Integer getServoGroupId() {
        return this.servoGroupId;
    }

    public void setServoGroupId(Integer servoGroupId) {
        this.propertyChanged.firePropertyChange("servoGroupId", this.servoGroupId, this.servoGroupId = servoGroupId);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "RobotId", nullable = false)
    public Robot getRobot() {
        return this.robot;
    }

    public void setRobot(Robot robot) {
        this.propertyChanged.firePropertyChange("robot", this.robot, this.robot = robot);
    }

    @Column(name = "Title", nullable = false, length = 30)
    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.propertyChanged.firePropertyChange("title", this.title, this.title = title);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="servoGroup")
    public List<Servo> getServos() {
        return servos;
    }

    public void setServos(List<Servo> servos) {
        this.propertyChanged.firePropertyChange("servos", this.servos, this.servos = servos);
    }

    @Column(name = "LocationX")
    public Integer getLocationX() {
        return this.locationX;
    }

    public void setLocationX(Integer locationX) {
        this.propertyChanged.firePropertyChange("locationX", this.locationX, this.locationX = locationX);
    }

    @Column(name = "LocationY")
    public Integer getLocationY() {
        return this.locationY;
    }

    public void setLocationY(Integer locationY) {
        this.propertyChanged.firePropertyChange("locationY", this.locationY, this.locationY = locationY);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
