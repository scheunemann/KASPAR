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
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "ServoTypes")
public class ServoType implements java.io.Serializable {

    private Integer servoTypeId;
    private String name;
    private int maxPosition;
    private int minPosition;
    private int maxSpeed;
    private int minSpeed;
    private boolean positionable;
    private int cyclesUntilReact;
    private int cycleError;
    private int positionError;
    private Set<ServoConfig> servoConfigs = new HashSet<ServoConfig>(0);
    private Set<Servo> servos = new HashSet<Servo>(0);
    protected PropertyChangeSupport propertyChanged;

    public ServoType() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public ServoType(String name, int maxPosition, int minPosition, int maxSpeed, int minSpeed, boolean positionable, int cyclesUntilReact, int cycleError) {
        this();
        this.name = name;
        this.maxPosition = maxPosition;
        this.minPosition = minPosition;
        this.maxSpeed = maxSpeed;
        this.minSpeed = minSpeed;
        this.positionable = positionable;
        this.cyclesUntilReact = cyclesUntilReact;
        this.cycleError = cycleError;
    }

    public ServoType(String name, int maxPosition, int minPosition, int maxSpeed, int minSpeed, boolean positionable, int cyclesUntilReact, int cycleError, Set<ServoConfig> servoConfigs, Set<Servo> servos) {
        this(name, maxPosition, minPosition, maxSpeed, minSpeed, positionable, cyclesUntilReact, cycleError);
        this.servoConfigs = servoConfigs;
        this.servos = servos;
    }
    
    @Override
    public String toString() {
        return this.getName();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServoTypeId", unique = true, nullable = false)
    public Integer getServoTypeId() {
        return this.servoTypeId;
    }

    public void setServoTypeId(Integer servoTypeId) {
        this.propertyChanged.firePropertyChange("servoTypeId", this.servoTypeId, this.servoTypeId = servoTypeId);
    }

    @Column(name = "Name", nullable = false, length = 30)
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.propertyChanged.firePropertyChange("name", this.name, this.name = name);
    }

    @Column(name = "MaxPosition", nullable = false)
    public int getMaxPosition() {
        return this.maxPosition;
    }

    public void setMaxPosition(int maxPosition) {
        this.propertyChanged.firePropertyChange("maxPosition", this.maxPosition, this.maxPosition = maxPosition);
    }

    @Column(name = "MinPosition", nullable = false)
    public int getMinPosition() {
        return this.minPosition;
    }

    public void setMinPosition(int minPosition) {
        this.propertyChanged.firePropertyChange("minPosition", this.minPosition, this.minPosition = minPosition);
    }

    @Column(name = "MaxSpeed", nullable = false)
    public int getMaxSpeed() {
        return this.maxSpeed;
    }

    public void setMaxSpeed(int maxSpeed) {
        this.propertyChanged.firePropertyChange("maxSpeed", this.maxSpeed, this.maxSpeed = maxSpeed);
    }

    @Column(name = "MinSpeed", nullable = false)
    public int getMinSpeed() {
        return this.minSpeed;
    }

    public void setMinSpeed(int minSpeed) {
        this.propertyChanged.firePropertyChange("minSpeed", this.minSpeed, this.minSpeed = minSpeed);
    }

    @Column(name = "Positionable", nullable = false)
    public boolean isPositionable() {
        return this.positionable;
    }

    public void setPositionable(boolean positionable) {
        this.propertyChanged.firePropertyChange("positionable", this.positionable, this.positionable = positionable);
    }

    @Column(name = "CyclesUntilReact", nullable = false)
    public int getCyclesUntilReact() {
        return this.cyclesUntilReact;
    }

    public void setCyclesUntilReact(int cyclesUntilReact) {
        this.propertyChanged.firePropertyChange("cyclesUntilReact", this.cyclesUntilReact, this.cyclesUntilReact = cyclesUntilReact);
    }

    @Column(name = "CycleError", nullable = false)
    public int getCycleError() {
        return this.cycleError;
    }

    public void setCycleError(int cycleError) {
        this.propertyChanged.firePropertyChange("cycleError", this.cycleError, this.cycleError = cycleError);
    }
    
    @Column(name = "PositionError", nullable = false)
    public int getPositionError() {
        return this.positionError;
    }

    public void setPositionError(int positionError) {
        this.propertyChanged.firePropertyChange("positionError", this.positionError, this.positionError = positionError);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="servoType")
    public Set<ServoConfig> getServoConfigs() {
        return this.servoConfigs;
    }

    public void setServoConfigs(Set<ServoConfig> servoTypeConfigs) {
        this.propertyChanged.firePropertyChange("servoConfigs", this.servoConfigs, this.servoConfigs = servoConfigs);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="servoType")
    public Set<Servo> getServos() {
        return this.servos;
    }

    public void setServos(Set<Servo> servos) {
        this.propertyChanged.firePropertyChange("servos", this.servos, this.servos = servos);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
