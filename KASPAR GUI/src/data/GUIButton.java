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
import javax.persistence.ElementCollection;
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
@Table(name = "GUIButtons")
public class GUIButton implements java.io.Serializable, Cloneable {

    private Sequence sequence;
    private User user;
    private String title;
    private Set<String> hotKeys = new HashSet<String>(0);
    private Integer buttonId;
    private Integer locationX;
    private Integer locationY;
    private Set<InteractionLog> logs = new HashSet<InteractionLog>(0);
    protected PropertyChangeSupport propertyChanged;

    public GUIButton() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public GUIButton(Sequence sequence, User user, String title) {
        this();
        this.sequence = sequence;
        this.user = user;
        this.title = title;
    }
    
    @Override
    public String toString() {
        return this.getTitle();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ButtonId", unique = true, nullable = false)
    public Integer getButtonId() {
        return this.buttonId;
    }

    public void setButtonId(Integer buttonId) {
        this.propertyChanged.firePropertyChange("buttonId", this.buttonId, this.buttonId = buttonId);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "SequenceId", nullable = false)
    public Sequence getSequence() {
        return this.sequence;
    }

    public void setSequence(Sequence sequence) {
        this.propertyChanged.firePropertyChange("sequence", this.sequence, this.sequence = sequence);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "UserId", nullable = false)
    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.propertyChanged.firePropertyChange("user", this.user, this.user = user);
    }

    @Column(name = "Title", nullable = false, length = 30)
    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.propertyChanged.firePropertyChange("title", this.title, this.title = title);
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

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="button")
    public Set<InteractionLog> getLogs() {
        return this.logs;
    }

    public void setLogs(Set<InteractionLog> logs) {
        this.propertyChanged.firePropertyChange("logs", this.logs, this.logs = logs);
    }
    
    @ElementCollection(fetch= FetchType.LAZY, targetClass= String.class)
    public Set<String> getHotKeys() {
        return this.hotKeys;
    }
    
    public void setHotKeys(Set<String> hotKeys) {
        this.propertyChanged.firePropertyChange("hotKeys", this.hotKeys, this.hotKeys = hotKeys);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
    
    @Override
    public GUIButton clone() {
        GUIButton ret = new GUIButton();
        
        ret.setSequence(this.sequence);
        ret.setHotKeys(this.hotKeys);
        ret.setLocationX(this.locationX);
        ret.setLocationY(this.locationY);
        ret.setTitle(this.title);
        ret.setUser(this.user);
        
        return ret;
    }
}
