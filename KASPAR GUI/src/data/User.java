/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;

@Entity
@Table(name = "Users")
public class User implements java.io.Serializable, Comparable<User> {

    private Integer userId;
    private String name;
    private List<GUIButton> buttons = new ArrayList<GUIButton>(0);
    private Set<Interaction> interactions = new HashSet<Interaction>(0);
    private Set<UserPose> userPoses = new HashSet<UserPose>(0);
    private Set<UserSound> userSounds = new HashSet<UserSound>(0);
    private Set<Operator> operators = new HashSet<Operator>(0);
    protected PropertyChangeSupport propertyChanged;

    public User() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public User(String name) {
        this();
        this.name = name;
    }

    public User(String name, Set<Interaction> interactions, Set<Operator> operators, List<GUIButton> buttons, Set<UserPose> userPoses, Set<UserSound> userSounds) {
        this(name);
        this.interactions = interactions;
        this.operators = operators;
        this.buttons = buttons;
        this.userPoses = userPoses;
        this.userSounds = userSounds;
    }
    
    @Override
    public String toString() {
        return this.getName();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserId", unique = true, nullable = false)
    public Integer getUserId() {
        return this.userId;
    }

    public void setUserId(Integer userId) {
        this.propertyChanged.firePropertyChange("userId", this.userId, this.userId = userId);
    }

    @Column(name = "Name", nullable = false, length = 45)
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.propertyChanged.firePropertyChange("name", this.name, this.name = name);
    }

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="users")
    public Set<Interaction> getInteractions() {
        return this.interactions;
    }

    public void setInteractions(Set<Interaction> interactions) {
        this.propertyChanged.firePropertyChange("interactions", this.interactions, this.interactions = interactions);
    }

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="users")
    public Set<Operator> getOperators() {
        return this.operators;
    }

    public void setOperators(Set<Operator> operators) {
        this.propertyChanged.firePropertyChange("operators", this.operators, this.operators = operators);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="user")
    @OrderColumn(name="ButtonOrder")
    public List<GUIButton> getButtons() {
        return this.buttons;
    }

    public void setButtons(List<GUIButton> buttons) {
        this.propertyChanged.firePropertyChange("buttons", this.buttons, this.buttons = buttons);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="user")
    public Set<UserPose> getUserPoses() {
        return this.userPoses;
    }

    public void setUserPoses(Set<UserPose> userPoses) {
        this.propertyChanged.firePropertyChange("userPoses", this.userPoses, this.userPoses = userPoses);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="user")
    public Set<UserSound> getUserSounds() {
        return this.userSounds;
    }

    public void setUserSounds(Set<UserSound> userSounds) {
        this.propertyChanged.firePropertyChange("userSounds", this.userSounds, this.userSounds = userSounds);
    }

    @Override
    public int compareTo(User otherUser) {
        return this.getName().compareTo(otherUser.getName());
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
