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

/**
 *
 * @author nathan
 */
@Entity
@Table(name = "Servos")
public class Servo implements java.io.Serializable {

    private int servoId;
    private ServoType servoType;
    private ServoGroup servoGroup;
    private String name;
    private int externalId;
    private double maxPosition;
    private double minPosition;
    private int maxSpeed;
    private int minSpeed;
    private double defaultPosition;
    private int defaultSpeed;
    protected PropertyChangeSupport propertyChanged;

    public Servo() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public Servo(ServoType servoType, String name, int externalId, int defaultPosition, int defaultSpeed) {
        this();
        this.servoType = servoType;
        this.name = name;
        this.externalId = externalId;
        this.defaultPosition = defaultPosition;
        this.defaultSpeed = defaultSpeed;
    }

    public Servo(ServoType servoType, String name, int externalId, int maxPosition, int minPosition, int maxSpeed, int minSpeed, int defaultPosition, int defaultSpeed) {
        this(servoType, name, externalId, defaultPosition, defaultSpeed);
        this.externalId = externalId;
        this.maxPosition = maxPosition;
        this.minPosition = minPosition;
        this.maxSpeed = maxSpeed;
        this.minSpeed = minSpeed;
    }
    
    @Override
    public String toString() {
        return String.format("Servo {0}", this.getName());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServoId", unique = true, nullable = false)
    public int getServoId() {
        return this.servoId;
    }

    public void setServoId(int servoId) {
        this.propertyChanged.firePropertyChange("servoId", this.servoId, this.servoId = servoId);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "ServoTypeId", nullable = false)
    public ServoType getServoType() {
        return this.servoType;
    }

    public void setServoType(ServoType servoType) {
        this.propertyChanged.firePropertyChange("servoType", this.servoType, this.servoType = servoType);
    }

    @Column(name = "Name", nullable = false, length = 30)
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.propertyChanged.firePropertyChange("name", this.name, this.name = name);
    }

    @Column(name = "ExternalId", nullable = false)
    public int getExternalId() {
        return this.externalId;
    }

    public void setExternalId(int externalId) {
        this.propertyChanged.firePropertyChange("externalId", this.externalId, this.externalId = externalId);
    }

    @Column(name = "MaxPosition")
    public double getMaxPosition() {
        return this.maxPosition;
    }

    public void setMaxPosition(double maxPosition) {
        this.propertyChanged.firePropertyChange("maxPosition", this.maxPosition, this.maxPosition = maxPosition);
    }

    @Column(name = "MinPosition")
    public double getMinPosition() {
        return this.minPosition;
    }

    public void setMinPosition(double minPosition) {
        this.propertyChanged.firePropertyChange("minPosition", this.minPosition, this.minPosition = minPosition);
    }

    @Column(name = "MaxSpeed")
    public int getMaxSpeed() {
        return this.maxSpeed;
    }

    public void setMaxSpeed(int maxSpeed) {
        this.propertyChanged.firePropertyChange("maxSpeed", this.maxSpeed, this.maxSpeed = maxSpeed);
    }

    @Column(name = "MinSpeed")
    public int getMinSpeed() {
        return this.minSpeed;
    }

    public void setMinSpeed(int minSpeed) {
        this.propertyChanged.firePropertyChange("minSpeed", this.minSpeed, this.minSpeed = minSpeed);
    }

    @Column(name = "DefaultPosition", nullable = false)
    public double getDefaultPosition() {
        return this.defaultPosition;
    }

    public void setDefaultPosition(double defaultPosition) {
        this.propertyChanged.firePropertyChange("defaultPosition", this.defaultPosition, this.defaultPosition = defaultPosition);
    }

    @Column(name = "DefaultSpeed", nullable = false)
    public int getDefaultSpeed() {
        return this.defaultSpeed;
    }

    public void setDefaultSpeed(int defaultSpeed) {
        this.propertyChanged.firePropertyChange("defaultSpeed", this.defaultSpeed, this.defaultSpeed = defaultSpeed);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "ServoGroupId", nullable = false)
    public ServoGroup getServoGroup() {
        return servoGroup;
    }

    public void setServoGroup(ServoGroup servoGroup) {
        this.propertyChanged.firePropertyChange("servoGroup", this.servoGroup, this.servoGroup = servoGroup);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}