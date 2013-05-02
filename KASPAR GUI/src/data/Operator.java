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
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "Operators")
public class Operator implements java.io.Serializable {

    private Integer operatorId;
    private String name;
    private Set<Interaction> interactions = new HashSet<Interaction>(0);
    private Set<User> users = new HashSet<User>(0);
    private ApplicationLog.LogLevel minLogLevel; 
    protected PropertyChangeSupport propertyChanged;

    public Operator() {
        this.propertyChanged = new PropertyChangeSupport(this);
        this.minLogLevel = ApplicationLog.LogLevel.Error;
    }

    public Operator(String name) {
        this();
        this.name = name;
    }

    public Operator(String name, Set<Interaction> interactions, Set<User> users, ApplicationLog.LogLevel minLogLevel) {
        this(name);
        this.interactions = interactions;
        this.users = users;
        this.minLogLevel = minLogLevel;
    }
    
    @Override
    public String toString() {
        return this.getName();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OperatorId", unique = true, nullable = false)
    public Integer getOperatorId() {
        return this.operatorId;
    }

    public void setOperatorId(Integer operatorId) {
        this.propertyChanged.firePropertyChange("operatorId", this.operatorId, this.operatorId = operatorId);
    }

    @Column(name = "Name", nullable = false, length = 30)
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.propertyChanged.firePropertyChange("name", this.name, this.name = name);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="operator")
    public Set<Interaction> getInteractions() {
        return this.interactions;
    }

    public void setInteractions(Set<Interaction> interactions) {
        this.propertyChanged.firePropertyChange("interactons", this.interactions, this.interactions = interactions);
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "OperatorUsers", catalog = "KASPAR", joinColumns = {
        @JoinColumn(name = "OperatorId", nullable = false, updatable = false)}, inverseJoinColumns = {
        @JoinColumn(name = "UserId", nullable = false, updatable = false)})
    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.propertyChanged.firePropertyChange("users", this.users, this.users = users);
    }

    @Enumerated(EnumType.STRING)
    @Column(name="MinLogLevel", nullable=false)
    public ApplicationLog.LogLevel getMinLogLevel() {
        return minLogLevel;
    }

    public void setMinLogLevel(ApplicationLog.LogLevel minLogLevel) {
        this.propertyChanged.firePropertyChange("minLogLevel", this.minLogLevel, this.minLogLevel = minLogLevel);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}