/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * KasparPosePanel_new.java
 *
 * Created on 04-Oct-2010, 11:28:38
 */
package gui;

import data.Pose;
import data.Robot;
import data.Servo;
import data.ServoGroup;
import data.ServoPosition;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.DefaultListModel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import managers.SessionManager;
import runners.ActionRunner;

/**
 *
 * @author Sven
 */
public class PosePanel extends javax.swing.JPanel {

    private Set<ServoPanel> servoPanels;
    private Set<Pose> poses;
    private DefaultListModel poseListModel;
    private Pose currentPose;
    private Robot currentRobot;

    /**
     * Creates new form KasparPosePanel
     */
    public PosePanel(Robot robot) {

        // Load saved poses and populate list
        poses = new HashSet<Pose>();
        servoPanels = new HashSet<ServoPanel>();
        poseListModel = new DefaultListModel();
        this.currentRobot = robot;

        updatePoses();

        // Get the list of servos to create panels for
        // A panel can be in multiple groups
        for (ServoGroup sg : currentRobot.getServoGroups()) {
            for (Servo s : sg.getServos()) {
                ServoPanel sPanel = new ServoPanel(currentRobot, s);
                servoPanels.add(sPanel);
            }
        }

        // Now get the servo groups
        List<gui.ServoGroup> servoGroups = new LinkedList<gui.ServoGroup>();
        for (ServoGroup g : currentRobot.getServoGroups()) {
            gui.ServoGroup group = new gui.ServoGroup(this.currentRobot, g, servoPanels);
            servoGroups.add(group);
        }

        Collections.sort(servoGroups, new Comparator<gui.ServoGroup>() {
            @Override
            public int compare(gui.ServoGroup o1, gui.ServoGroup o2) {
                int val = 0;
                if (o1.getColumn() < o2.getColumn()) {
                    val = -1;
                } else if (o1.getColumn() > o2.getColumn()) {
                    val = 1;
                } else if (o1.getColumn() == o2.getColumn()) {
                    if (o1.getRow() < o2.getRow()) {
                        val = -1;
                    } else if (o1.getRow() > o2.getRow()) {
                        val = 1;
                    } else if (o1.getRow() == o2.getRow()) {
                        val = 0;
                    }
                }
                return val;
            }
        });

        initComponents();

        // add groups tp main panel
        for (int j = 0; j < servoGroups.size(); j++) {

            if (j == servoGroups.size() - 1 || servoGroups.get(j + 1).getColumn() > servoGroups.get(j).getColumn()) {
                // we only have one panel in this column
                pnlMain.add(servoGroups.get(j));

            } else {
                // we have more than one panel in this column
                JPanel buf = new JPanel();
                buf.setLayout(new BoxLayout(buf, BoxLayout.Y_AXIS));
                int curr_c = servoGroups.get(j).getColumn();
                int k;
                for (k = j; k < servoGroups.size() && servoGroups.get(k).getColumn() == curr_c; k++) {
                    if (k > 0) {
                        buf.add(Box.createVerticalStrut(5));
                    }
                    buf.add(servoGroups.get(k));
                }
                j += k - 1;
                buf.add(Box.createVerticalGlue());
                pnlMain.add(buf);
                pnlMain.add(Box.createHorizontalStrut(5));
            }
        }

        // Set the reset pose    
        setPose(currentRobot.getResetPose());
    }

    /**
     * This method is called from within the constructor to initialise the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        pnlMain = new javax.swing.JPanel();
        pnlButtons = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        lblPose = new javax.swing.JLabel();
        btnSave = new javax.swing.JButton();
        btnSaveAs = new javax.swing.JButton();
        btnDelete = new javax.swing.JButton();
        pnlPoses = new javax.swing.JPanel();
        jScrollPane1 = new javax.swing.JScrollPane();
        lstPoses = new javax.swing.JList();

        setBorder(javax.swing.BorderFactory.createEmptyBorder(3, 3, 3, 3));
        setName("Pose"); // NOI18N

        pnlMain.setBorder(javax.swing.BorderFactory.createEmptyBorder(3, 3, 3, 0));
        pnlMain.setLayout(new javax.swing.BoxLayout(pnlMain, javax.swing.BoxLayout.LINE_AXIS));

        pnlButtons.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(0, 0, 0), 1, true));

        jLabel1.setText("Pose:");

        lblPose.setFont(new java.awt.Font("Tahoma", 1, 14)); // NOI18N
        lblPose.setText("jLabel2");

        btnSave.setText("Save");
        btnSave.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnSaveActionPerformed(evt);
            }
        });

        btnSaveAs.setText("Save As...");
        btnSaveAs.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnSaveAsActionPerformed(evt);
            }
        });

        btnDelete.setText("Delete");
        btnDelete.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnDeleteActionPerformed(evt);
            }
        });

        org.jdesktop.layout.GroupLayout pnlButtonsLayout = new org.jdesktop.layout.GroupLayout(pnlButtons);
        pnlButtons.setLayout(pnlButtonsLayout);
        pnlButtonsLayout.setHorizontalGroup(
            pnlButtonsLayout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(pnlButtonsLayout.createSequentialGroup()
                .addContainerGap()
                .add(pnlButtonsLayout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
                    .add(pnlButtonsLayout.createSequentialGroup()
                        .add(jLabel1)
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                        .add(lblPose, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 188, Short.MAX_VALUE))
                    .add(org.jdesktop.layout.GroupLayout.TRAILING, pnlButtonsLayout.createSequentialGroup()
                        .add(btnSave)
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                        .add(btnSaveAs)
                        .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                        .add(btnDelete)))
                .addContainerGap())
        );
        pnlButtonsLayout.setVerticalGroup(
            pnlButtonsLayout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(pnlButtonsLayout.createSequentialGroup()
                .addContainerGap()
                .add(pnlButtonsLayout.createParallelGroup(org.jdesktop.layout.GroupLayout.BASELINE)
                    .add(jLabel1, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, 17, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                    .add(lblPose))
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                .add(pnlButtonsLayout.createParallelGroup(org.jdesktop.layout.GroupLayout.BASELINE)
                    .add(btnDelete)
                    .add(btnSaveAs)
                    .add(btnSave))
                .addContainerGap(org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pnlPoses.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(0, 0, 0), 1, true));

        lstPoses.setModel(getPoseListModel());
        lstPoses.setSelectionMode(javax.swing.ListSelectionModel.SINGLE_SELECTION);
        lstPoses.addListSelectionListener(new javax.swing.event.ListSelectionListener() {
            public void valueChanged(javax.swing.event.ListSelectionEvent evt) {
                lstPosesValueChanged(evt);
            }
        });
        jScrollPane1.setViewportView(lstPoses);

        org.jdesktop.layout.GroupLayout pnlPosesLayout = new org.jdesktop.layout.GroupLayout(pnlPoses);
        pnlPoses.setLayout(pnlPosesLayout);
        pnlPosesLayout.setHorizontalGroup(
            pnlPosesLayout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(pnlPosesLayout.createSequentialGroup()
                .addContainerGap()
                .add(jScrollPane1, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 221, Short.MAX_VALUE)
                .addContainerGap())
        );
        pnlPosesLayout.setVerticalGroup(
            pnlPosesLayout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(pnlPosesLayout.createSequentialGroup()
                .addContainerGap()
                .add(jScrollPane1, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 471, Short.MAX_VALUE)
                .addContainerGap())
        );

        org.jdesktop.layout.GroupLayout layout = new org.jdesktop.layout.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(org.jdesktop.layout.GroupLayout.TRAILING, layout.createSequentialGroup()
                .add(pnlMain, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 340, Short.MAX_VALUE)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                .add(layout.createParallelGroup(org.jdesktop.layout.GroupLayout.TRAILING, false)
                    .add(pnlPoses, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .add(pnlButtons, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(org.jdesktop.layout.GroupLayout.LEADING)
            .add(layout.createSequentialGroup()
                .add(pnlButtons, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(org.jdesktop.layout.LayoutStyle.RELATED)
                .add(pnlPoses, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .add(pnlMain, org.jdesktop.layout.GroupLayout.DEFAULT_SIZE, 573, Short.MAX_VALUE)
        );
    }// </editor-fold>//GEN-END:initComponents

    private void btnSaveActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnSaveActionPerformed
        save();
    }//GEN-LAST:event_btnSaveActionPerformed

    private void btnSaveAsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnSaveAsActionPerformed
        saveAs();
    }//GEN-LAST:event_btnSaveAsActionPerformed

    private void btnDeleteActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnDeleteActionPerformed
        if (!currentPose.getName().equals("Reset")) {
            SessionManager.delete(currentPose);
            updatePoses();
            setPose(null);
        }
    }//GEN-LAST:event_btnDeleteActionPerformed

    private void lstPosesValueChanged(javax.swing.event.ListSelectionEvent evt) {//GEN-FIRST:event_lstPosesValueChanged
        if (lstPoses.getSelectedIndex() != -1) {
            // Something is selected, so extract pose and set sliders
            Pose pose = (Pose) lstPoses.getSelectedValue();
            setPose(pose);
        }
    }//GEN-LAST:event_lstPosesValueChanged
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnDelete;
    private javax.swing.JButton btnSave;
    private javax.swing.JButton btnSaveAs;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JLabel lblPose;
    private javax.swing.JList lstPoses;
    private javax.swing.JPanel pnlButtons;
    private javax.swing.JPanel pnlMain;
    private javax.swing.JPanel pnlPoses;
    // End of variables declaration//GEN-END:variables

    private void loadPoses() {

        poses.clear();
        poses.addAll(SessionManager.getValidPoses(this.currentRobot));
    }

    public final void updatePoses() {

        loadPoses();
        poseListModel.clear();
        // Sort sequences
        LinkedList<Pose> seqs = new LinkedList<Pose>();
        seqs.addAll(poses);
        Collections.sort(seqs);

        // and add to list model
        for (Pose pose : seqs) {
            poseListModel.addElement(pose);
        }
    }

    public DefaultListModel getPoseListModel() {
        return poseListModel;
    }

    private void save() {

        // Check if we have to save a new one
        if (currentPose == null || currentPose.equals(currentRobot.getResetPose())) {
            saveAs();
        } else {
            setFromSliders(currentPose);
            SessionManager.save(currentPose);
        }

        // Reload all poses
        updatePoses();

        // Now make sure the changes take effect in control panel and in sequences
        // TODO: Property change events
        //KasparGui.getInstance().posesChanged();

    }

    private void saveAs() {

        // Get name to save pose as
        final String name = (String) JOptionPane.showInputDialog(
                this,
                "Name of Pose: ",
                "Save Pose",
                JOptionPane.PLAIN_MESSAGE,
                null, null, "");

        // Check if we've go a valid name
        // TODO Could be better to check for valid characters
        Pose resetPose = currentRobot.getResetPose();
        
        if (name == null || name.equals("") || (resetPose != null && name.equals(resetPose.getName()))) {
            GuiLogger.getLogger().log(Level.WARNING, "Invalid name for pose: ''{0}''!", name);
            return;
        }

        Pose pose = null;
        for (Pose p : this.poses) {
            if (name.equals(p.getName())) {
                int answer = JOptionPane.showConfirmDialog(this, "Pose with this name already exists and will be overwritten\nAre you sure?", "Confirmation", JOptionPane.YES_NO_OPTION);
                if (answer == 1) {
                    return;
                }
                
                pose = p;
                break;
            }
        }

        if (pose == null) {
            pose = new Pose(name);
        }

        setFromSliders(pose);        
        SessionManager.save(pose);
        setPose(pose);

        // Reload all poses and update view
        updatePoses();

        // Tell main class that something has changed
        //TODO: Property change events
        //KasparGui.getInstance().posesChanged();
    }

    private void setFromSliders(Pose oldPose) {

        oldPose.getServoPositions().clear();

        // Take positions and speeds from all active ServoPanels
        for (ServoPanel sPanel : servoPanels) {

            if (sPanel.isActive()) {
                oldPose.getServoPositions().add(sPanel.getServoData());
            }
        }
    }

    private void setPose(Pose selPose) {
        if (selPose != null) {
            currentPose = selPose;
            lblPose.setText(currentPose.getName());
            // Don't allow save/delete if pose is reset pose
            if (!selPose.equals(currentRobot.getResetPose())) {
                btnSave.setEnabled(true);
                btnDelete.setEnabled(true);
            } else {
                btnSave.setEnabled(false);
                btnDelete.setEnabled(false);
            }
            selectAll(false);
            // Set the panels according to selected pose
            for (final ServoPosition sPos : currentPose.getServoPositions()) {
                for (ServoPanel pnl : this.servoPanels) {
                    if (sPos.getServoName() == null
                            ? pnl.getServo().getName() == null
                            : sPos.getServoName().equals(pnl.getServo().getName())) {
                        pnl.setServoData(sPos);
                        pnl.setActive(true);
                    }
                }
            }

            // And execute the position
            ActionRunner ar = new ActionRunner(this.currentRobot);
            ar.execute(currentPose);
        } else {
            lblPose.setText("Unsaved Pose");
            currentPose = null;
            btnSave.setEnabled(false);
            btnDelete.setEnabled(false);
        }
    }

    void selectAll(boolean state) {
        for (ServoPanel sp : servoPanels) {
            sp.setActive(state);
        }
    }
}
