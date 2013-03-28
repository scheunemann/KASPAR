package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author nathan
 */
@Entity
@Table(name = "ServoConfigs")
public class ServoConfig implements java.io.Serializable {

    private ServoType servoType;
    private Robot robot;
    private int port;
    private int portSpeed;
    private double abstractToRealSpeedFactor;
    private double abstractToRealPositionFactor;
    protected PropertyChangeSupport propertyChanged;

    public ServoConfig() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public ServoConfig(ServoType servoType, Robot robot, int port, int portSpeed, double abstractToRealSpeedFactor, double abstractToRealPositionFactor) {
        this();
        this.servoType = servoType;
        this.robot = robot;
        this.port = port;
        this.portSpeed = portSpeed;
        this.abstractToRealPositionFactor = abstractToRealPositionFactor;
        this.abstractToRealSpeedFactor = abstractToRealSpeedFactor;
    }
    
    @Override
    public String toString() {
        return String.format("{0}'s ServoConfig for type {0}", this.getRobot(), this.getServoType());
    }

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "ServoTypeId", nullable = false)
    public ServoType getServoType() {
        return this.servoType;
    }

    public void setServoType(ServoType servoType) {
        this.propertyChanged.firePropertyChange("servoType", this.servoType, this.servoType = servoType);
    }

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "RobotId", nullable = false)
    public Robot getRobot() {
        return this.robot;
    }

    public void setRobot(Robot robot) {
        this.propertyChanged.firePropertyChange("robot", this.robot, this.robot = robot);
    }

    @Column(name = "Port", nullable = false, length = 30)
    public int getPort() {
        return this.port;
    }

    public void setPort(int port) {
        this.propertyChanged.firePropertyChange("port", this.port, this.port = port);
    }

    @Column(name = "PortSpeed", nullable = false)
    public int getPortSpeed() {
        return this.portSpeed;
    }

    public void setPortSpeed(int portSpeed) {
        this.propertyChanged.firePropertyChange("portSpeed", this.portSpeed, this.portSpeed = portSpeed);
    }

    @Column(name = "AbstractToRealSpeedFactor", nullable = false)
    public double getAbstractToRealSpeedFactor() {
        return abstractToRealSpeedFactor;
    }

    public void setAbstractToRealSpeedFactor(double abstractToRealSpeedFactor) {
        this.propertyChanged.firePropertyChange("abstractToRealSpeedFactor", this.abstractToRealSpeedFactor, this.abstractToRealSpeedFactor = abstractToRealSpeedFactor);
    }

    @Column(name = "AbstractToRealPositionFactor", nullable = false)
    public double getAbstractToRealPositionFactor() {
        return abstractToRealPositionFactor;
    }

    public void setAbstractToRealPositionFactor(double abstractToRealPositionFactor) {
        this.propertyChanged.firePropertyChange("abstractToRealPositionFactor", this.abstractToRealPositionFactor, this.abstractToRealPositionFactor = abstractToRealPositionFactor);
    }
    
    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}