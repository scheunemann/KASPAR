/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.Date;
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
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "Interactions")
public class Interaction implements java.io.Serializable {

    private Set<User> users = new HashSet<User>(0);
    private Set<Robot> robots = new HashSet<Robot>(0);
    private Operator operator;
    private Integer interactionId;
    private Date startTime;
    private Date endTime;
    private Set<InteractionLog> logs = new HashSet<InteractionLog>(0);
    protected PropertyChangeSupport propertyChanged;

    public Interaction() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public Interaction(Operator operator, Date startTime) {
        this();
        this.operator = operator;
        this.startTime = startTime;
    }

    public Interaction(Operator operator, Date startTime, Date endTime, Set<User> users, Set<Robot> robots, Set<InteractionLog> logs) {
        this(operator, startTime);
        this.endTime = endTime;
        this.users = users;
        this.robots = robots;
        this.logs = logs;
    }
    
    @Override
    public String toString() {
        return String.format("Interaction{0}", this.getInteractionId());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InteractionId", unique = true, nullable = false)
    public Integer getInteractionId() {
        return this.interactionId;
    }

    public void setInteractionId(Integer interactionId) {
        this.propertyChanged.firePropertyChange("interactionId", this.interactionId, this.interactionId = interactionId);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "OperatorId", nullable = false)
    public Operator getOperator() {
        return this.operator;
    }

    public void setOperator(Operator operator) {
        this.propertyChanged.firePropertyChange("operator", this.operator, this.operator = operator);
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "StartTime", nullable = false, length = 19)
    public Date getStartTime() {
        return this.startTime;
    }

    public void setStartTime(Date startTime) {
        this.propertyChanged.firePropertyChange("startTime", this.startTime, this.startTime = startTime);
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "EndTime", length = 19)
    public Date getEndTime() {
        return this.endTime;
    }

    public void setEndTime(Date endTime) {
        this.propertyChanged.firePropertyChange("endTime", this.endTime, this.endTime = endTime);
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "InteractionUsers", catalog = "KASPAR", joinColumns = {
        @JoinColumn(name = "InteractionId", nullable = false, updatable = false)}, inverseJoinColumns = {
        @JoinColumn(name = "UserId", nullable = false, updatable = false)})
    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.propertyChanged.firePropertyChange("users", this.users, this.users = users);
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "InteractionRobots", catalog = "KASPAR", joinColumns = {
        @JoinColumn(name = "InteractionId", nullable = false, updatable = false)}, inverseJoinColumns = {
        @JoinColumn(name = "RobotId", nullable = false, updatable = false)})
    public Set<Robot> getRobots() {
        return this.robots;
    }

    public void setRobots(Set<Robot> robots) {
        this.propertyChanged.firePropertyChange("robots", this.robots, this.robots = robots);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="interaction")
    public Set<InteractionLog> getLogs() {
        return this.logs;
    }

    public void setLogs(Set<InteractionLog> logs) {
        this.propertyChanged.firePropertyChange("logs", this.logs, this.logs = logs);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
