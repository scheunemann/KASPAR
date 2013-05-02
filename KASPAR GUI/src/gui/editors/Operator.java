/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;

import data.ApplicationLog;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import javax.swing.DefaultListModel;

/**
 *
 * @author nathan
 */
public class Operator extends ModelEditor<data.Operator> {

    DefaultListModel users;
    DefaultListModel allUsers;
    Collection<data.User> allUsersList;
    guiComboBox<ApplicationLog.LogLevel> logLevelCombo;

    public Operator() {
        super();
        initComponents();
    }
    
    public Operator(Collection<data.User> allUsers) {
        this();
        logLevelCombo = guiHelper.addComboBox(Arrays.asList(ApplicationLog.LogLevel.values()), this, 1, 1);
        this.allUsersList = allUsers;
    }
    
    @Override
    public void revertChanges() {        
        List<data.User> filteredUsers = new ArrayList<data.User>();
        if (allUsersList != null) {
            for (data.User u : allUsersList) {
                if (!this.model.getUsers().contains(u)) {
                    filteredUsers.add(u);
                }
            }
        }

        this.jTextFieldName.setText(this.model.getName());
        
        this.allUsers = guiHelper.getListModel(filteredUsers);
        this.jListAllUsers.setModel(this.allUsers);
        
        this.users = guiHelper.getListModel(this.model.getUsers());
        this.jListUsers.setModel(this.users);

        this.logLevelCombo.setSelectedItem(this.model.getMinLogLevel());        
    }
    
    @Override
    public void commitChanges() {
        List<data.User> userList = new ArrayList<data.User>();
        for (Object u : this.users.toArray()) {
            userList.add((data.User) u);
        }

        this.model.setName(this.jTextFieldName.getText());
        this.model.getUsers().clear();
        this.model.getUsers().addAll(userList);
        this.model.setMinLogLevel(this.logLevelCombo.getSelectedItem());
    }
    
    /**
     * This method is called from within the constructor to initialise the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {
        java.awt.GridBagConstraints gridBagConstraints;

        jScrollPane1 = new javax.swing.JScrollPane();
        jListAllUsers = new javax.swing.JList();
        jLabelName = new javax.swing.JLabel();
        jLabelLogLevel = new javax.swing.JLabel();
        jLabelUsers = new javax.swing.JLabel();
        jTextFieldName = new javax.swing.JTextField();
        jScrollPane2 = new javax.swing.JScrollPane();
        jListUsers = new javax.swing.JList();
        jPanel1 = new javax.swing.JPanel();
        jButtonOK = new javax.swing.JButton();
        jButtonCancel = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jButtonAddUsers = new javax.swing.JButton();
        jButtonRemoveUsers = new javax.swing.JButton();

        setLayout(new java.awt.GridBagLayout());

        jScrollPane1.setViewportView(jListAllUsers);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 3;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.gridheight = 4;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.weighty = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jScrollPane1, gridBagConstraints);

        jLabelName.setText("Name");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.ipadx = 18;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelName, gridBagConstraints);

        jLabelLogLevel.setText("Log Level");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.ipady = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelLogLevel, gridBagConstraints);

        jLabelUsers.setText("Users");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.ipadx = 18;
        gridBagConstraints.ipady = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelUsers, gridBagConstraints);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 155;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jTextFieldName, gridBagConstraints);

        jScrollPane2.setViewportView(jListUsers);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.weighty = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jScrollPane2, gridBagConstraints);

        jPanel1.setLayout(new java.awt.GridBagLayout());

        jButtonOK.setText("OK");
        jButtonOK.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonOKActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        jPanel1.add(jButtonOK, gridBagConstraints);

        jButtonCancel.setText("Cancel");
        jButtonCancel.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonCancelActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.NORTHWEST;
        jPanel1.add(jButtonCancel, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 3;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.SOUTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jPanel1, gridBagConstraints);

        jPanel2.setLayout(new java.awt.GridBagLayout());

        jButtonAddUsers.setLabel("<-");
        jButtonAddUsers.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonAddUsersActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        jPanel2.add(jButtonAddUsers, gridBagConstraints);

        jButtonRemoveUsers.setLabel("->");
        jButtonRemoveUsers.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonRemoveUsersActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        jPanel2.add(jButtonRemoveUsers, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 2;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.gridheight = 2;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jPanel2, gridBagConstraints);
    }// </editor-fold>//GEN-END:initComponents

    private void jButtonAddUsersActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonAddUsersActionPerformed
        // TODO add your handling code here:
        for (Object u : this.jListAllUsers.getSelectedValues()) {
            this.allUsers.removeElement(u);
            this.users.addElement(u);
        }
    }//GEN-LAST:event_jButtonAddUsersActionPerformed

    private void jButtonRemoveUsersActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonRemoveUsersActionPerformed
        for (Object u : this.jListUsers.getSelectedValues()) {
            this.users.removeElement(u);
            this.allUsers.addElement(u);
        }
    }//GEN-LAST:event_jButtonRemoveUsersActionPerformed

    private void jButtonCancelActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonCancelActionPerformed
        this.close(false);
    }//GEN-LAST:event_jButtonCancelActionPerformed

    private void jButtonOKActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonOKActionPerformed
        this.close(true);
    }//GEN-LAST:event_jButtonOKActionPerformed
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton jButtonAddUsers;
    private javax.swing.JButton jButtonCancel;
    private javax.swing.JButton jButtonOK;
    private javax.swing.JButton jButtonRemoveUsers;
    private javax.swing.JLabel jLabelLogLevel;
    private javax.swing.JLabel jLabelName;
    private javax.swing.JLabel jLabelUsers;
    private javax.swing.JList jListAllUsers;
    private javax.swing.JList jListUsers;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JTextField jTextFieldName;
    // End of variables declaration//GEN-END:variables
}
