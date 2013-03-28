/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "Sounds")
@PrimaryKeyJoinColumn(name = "SoundId")
public class Sound extends Action {

    private String soundFile;
    private Set<UserSound> userSounds = new HashSet<UserSound>(0);

    public Sound() {
        super();
    }

    public Sound(String title, String soundFile) {
        super(title);
        this.soundFile = soundFile;
    }

    public Sound(String title, String sound, Set<UserSound> userSounds) {
        this(title, sound);
        this.userSounds = userSounds;
    }

    @Column(name = "Sound", nullable = false, length = 500)
    public String getSoundFile() {
        return this.soundFile;
    }

    public void setSoundFile(String soundFile) {
        this.propertyChanged.firePropertyChange("soundFile", this.soundFile, this.soundFile = soundFile);
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="overridenSound")
    public Set<UserSound> getUserSounds() {
        return this.userSounds;
    }

    public void setUserSounds(Set<UserSound> userSounds) {
        this.propertyChanged.firePropertyChange("userSounds", this.userSounds, this.userSounds = userSounds);
    }
}
