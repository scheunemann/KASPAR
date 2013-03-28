/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;

@Entity
@Table(name = "Actions")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Action implements java.io.Serializable, Comparable<Action> {

    private Integer actionId;
    private String name;
    protected PropertyChangeSupport propertyChanged;

    public Action() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public Action(String name) {
        this();
        this.name = name;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ActionId", unique = true, nullable = false)
    public Integer getActionId() {
        return this.actionId;
    }

    public void setActionId(Integer actionId) {
        this.propertyChanged.firePropertyChange("actionId", this.actionId, this.actionId=actionId);
    }

    @Column(name = "Name", nullable = false, length = 500)
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.propertyChanged.firePropertyChange("name", this.name, this.name=name);
    }

    @Override
    public int compareTo(Action otherAction) {
        return this.getName().compareTo(otherAction.getName());
    }

    @Override
    public String toString() {
        return this.getName();
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
