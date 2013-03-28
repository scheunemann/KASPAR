/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "UserSounds")
@PrimaryKeyJoinColumn(name = "UserSoundId")
public class UserSound extends Sound {

    private User user;
    private Sound overridenSound;

    public UserSound() {
        super();
    }

    public UserSound(String title, String sound, Sound overridenSound, User user) {
        super(title, sound);
        this.user = user;
        this.overridenSound = overridenSound;
    }

    @ManyToOne(optional=false, fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", nullable = false)
    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.propertyChanged.firePropertyChange("user", this.user, this.user = user);
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OverridenSoundId", nullable = false)
    public Sound getOverridenSound() {
        return this.overridenSound;
    }

    public void setOverridenSound(Sound overridenSound) {
        this.propertyChanged.firePropertyChange("overridenSound", this.overridenSound, this.overridenSound = overridenSound);
    }
}
