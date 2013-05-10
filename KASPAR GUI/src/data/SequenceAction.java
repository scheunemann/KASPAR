/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import javax.persistence.CascadeType;
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
@Table(name = "SequenceActions")
public class SequenceAction implements java.io.Serializable, Cloneable {

    private Sequence sequence;
    private Action action;
    private int waitAfter; //Milliseconds
    private int sequenceActionId;
    protected PropertyChangeSupport propertyChanged;

    public SequenceAction() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public SequenceAction(Sequence sequence, Action action, int waitAfter) {
        this();
        this.action = action;
        this.sequence = sequence;
        this.waitAfter = waitAfter;
    }
    
    @Override
    public String toString() {
        return String.format("Action {1} for Sequence {0}", this.sequence, this.action);
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SequenceActionId", unique = true, nullable = false)
    public Integer getSequenceActionId() {
        return this.sequenceActionId;
    }

    public void setSequenceActionId(Integer actionId) {
        this.propertyChanged.firePropertyChange("sequenceActionId", this.sequenceActionId, this.sequenceActionId = actionId);
    }
    
    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "ActionId", nullable = false)
    public Action getAction() {
        return this.action;
    }

    public void setAction(Action action) {
        this.propertyChanged.firePropertyChange("action", this.action, this.action = action);
    }

    @Column(name = "waitAfter", nullable = false)
    public int getWaitAfter() {
        return this.waitAfter;
    }

    public void setWaitAfter(int pauseAfter) {
        this.propertyChanged.firePropertyChange("waitAfter", this.waitAfter, this.waitAfter = pauseAfter);
    }
    
    @Id
    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "SequenceId", nullable = false)
    public Sequence getSequence() {
        return this.sequence;
    }

    public void setSequence(Sequence sequence) {
        this.propertyChanged.firePropertyChange("sequence", this.sequence, this.sequence = sequence);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
    
    @Override
    public SequenceAction clone() {
        SequenceAction ret = new SequenceAction();
        
        ret.setAction(this.action);
        ret.setSequence(this.sequence);
        ret.setWaitAfter(this.waitAfter);
        
        return ret;
    }
}
