/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package managers;

import javax.swing.DefaultListModel;

/**
 *
 * @author nathan
 */
public class PanelManager {
    private static DefaultListModel sequenceListModel;
    private static DefaultListModel poseListModel;

    /**
     * @return the sequenceListModel
     */
    public static DefaultListModel getSequenceListModel() {
        return sequenceListModel;
    }

    /**
     * @param aSequenceListModel the sequenceListModel to set
     */
    public static void setSequenceListModel(DefaultListModel aSequenceListModel) {
        sequenceListModel = aSequenceListModel;
    }

    /**
     * @return the poseListModel
     */
    public static DefaultListModel getPoseListModel() {
        return poseListModel;
    }

    /**
     * @param aPoseListModel the poseListModel to set
     */
    public static void setPoseListModel(DefaultListModel aPoseListModel) {
        poseListModel = aPoseListModel;
    }

}
