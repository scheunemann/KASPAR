/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "Sequences")
@PrimaryKeyJoinColumn(name="SequenceId")
public class Sequence extends Action implements Cloneable {

    private List<SequenceAction> sequenceActions = new java.util.ArrayList<SequenceAction>(0);
    private boolean isParallelable;
    private Set<GUIButton> buttons = new HashSet<GUIButton>(0);

    public Sequence() {
        super();
    }

    public Sequence(String title) {
        super(title);
    }

    public Sequence(String title, List<SequenceAction> sequenceActions, Set<GUIButton> buttons, boolean parallelable) {
        this(title);
        this.sequenceActions = sequenceActions;
        this.buttons = buttons;
        this.isParallelable = parallelable;
    }
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="sequence")
    @OrderColumn(name="ExecutionOrder")
    public List<SequenceAction> getSequenceActions() {
        return this.sequenceActions;
    }

    public void setSequenceActions(List<SequenceAction> sequenceActions) {
        this.propertyChanged.firePropertyChange("sequenceActions", this.sequenceActions, this.sequenceActions = sequenceActions);
    }
    
    @Column(name = "parallelable", nullable = false)
    public boolean isParallelable() {
        return isParallelable;
    }

    public void setParallelable(boolean isParallelable) {
        this.isParallelable = isParallelable;
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy="sequence")
    public Set<GUIButton> getButtons() {
        return this.buttons;
    }

    public void setButtons(Set<GUIButton> buttons) {
        this.propertyChanged.firePropertyChange("buttons", this.buttons, this.buttons = buttons);
    }
    
    @Override
    public Sequence clone() {
        Sequence ret = new Sequence();
        
        ret.setName(this.getName());
        for(GUIButton b: this.getButtons()){
            GUIButton newB = b.clone();
            newB.setSequence(ret);
            ret.getButtons().add(newB);
        }
        
        for(SequenceAction sa: this.getSequenceActions()) {
            SequenceAction newSA = sa.clone();
            newSA.setSequence(ret);
            ret.getSequenceActions().add(newSA);
        }
        
        ret.setParallelable(this.isParallelable);
        
        return ret;
    }
}
