/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "InteractionLogs")
public class InteractionLog implements java.io.Serializable {

    private Integer logId;
    private Interaction interaction;
    private GUIButton button;
    private Date timestamp;
    protected PropertyChangeSupport propertyChanged;

    public InteractionLog() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public InteractionLog(GUIButton button, Interaction interaction, Date timestamp) {
        this();
        this.button = button;
        this.interaction = interaction;
        this.timestamp = timestamp;
    }
    
    @Override
    public String toString() {
        return String.format("{0}-{1}: {2}", this.getInteraction(), this.getTimestamp(), this.getButton());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LogId", unique = true, nullable = false)
    public Integer getLogId() {
        return this.logId;
    }

    public void setLogId(Integer logId) {
        this.propertyChanged.firePropertyChange("logId", this.logId, this.logId = logId);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "ButtonId", nullable = false)
    public GUIButton getButton() {
        return this.button;
    }

    public void setButton(GUIButton button) {
        this.propertyChanged.firePropertyChange("button", this.button, this.button = button);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "InteractionId", nullable = false)
    public Interaction getInteraction() {
        return this.interaction;
    }

    public void setInteraction(Interaction interaction) {
        this.propertyChanged.firePropertyChange("interaction", this.interaction, this.interaction = interaction);
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "LogTime", nullable = false, length = 19)
    public Date getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(Date time) {
        this.propertyChanged.firePropertyChange("time", this.timestamp, this.timestamp = timestamp);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
