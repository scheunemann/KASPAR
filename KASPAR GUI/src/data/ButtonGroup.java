/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.ArrayList;
import java.util.List;
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
import javax.persistence.OrderColumn;
import javax.persistence.Table;

@Entity
@Table(name = "ButtonGroups")
public class ButtonGroup implements java.io.Serializable {

    private Integer buttonGroupId;
    private String title;
    private List<GUIButton> buttons = new ArrayList<GUIButton>(0);
    protected PropertyChangeSupport propertyChanged;

    public ButtonGroup() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public ButtonGroup(String title) {
        this();
        this.title = title;
    }

    public ButtonGroup(String title, List<GUIButton> buttons) {
        this(title);
        this.buttons = buttons;
    }
    
    @Override
    public String toString() {
        return this.getTitle();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ButtonGroupId", unique = true, nullable = false)
    public Integer getButtonGroupId() {
        return this.buttonGroupId;
    }

    public void setButtonGroupId(Integer buttonGroupId) {
        this.propertyChanged.firePropertyChange("buttonGroupId", this.buttonGroupId, this.buttonGroupId = buttonGroupId);
    }

    @Column(name = "Title", nullable = false, length = 30)
    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.propertyChanged.firePropertyChange("title", this.title, this.title = title);
    }

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderColumn(name="OrderInGroup")
    @JoinTable(name = "ButtonGroupGUIButtons", joinColumns = {
        @JoinColumn(name = "ButtonGroupId", nullable = false, updatable = false)}, inverseJoinColumns = {
        @JoinColumn(name = "GUIButtonId", nullable = false, updatable = false)})
    public List<GUIButton> getButtons() {
        return this.buttons;
    }

    public void setButtons(List<GUIButton> buttons) {
        this.propertyChanged.firePropertyChange("buttons", this.buttons, this.buttons = buttons);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
