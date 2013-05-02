/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;


/**
 *
 * @author nathan
 */
public class ServoType extends ModelEditor<data.ServoType> {

    public ServoType() {
        super();
        initComponents();
    }

    @Override
    public void revertChanges() {
        this.jTextFieldName.setText(this.model.getName());
        this.jFormattedTextFieldMaxPosition.setValue(this.model.getMaxPosition());
        this.jFormattedTextFieldMinPosition.setValue(this.model.getMinPosition());
        this.jFormattedTextFieldMaxSpeed.setValue(this.model.getMaxSpeed());
        this.jFormattedTextFieldMinSpeed.setValue(this.model.getMinSpeed());
        this.jCheckBoxManuallyPositionable.setSelected(this.model.isPositionable());
        this.jFormattedTextFieldCyclesUntilReact.setValue(this.model.getCyclesUntilReact());
        this.jFormattedTextFieldCycleError.setValue(this.model.getCycleError());
        this.jFormattedTextFieldPositionError.setValue(this.model.getPositionError());
    }

    @Override
    public void commitChanges() {
        this.model.setName(this.jTextFieldName.getText());
        this.model.setMaxPosition(((Number) this.jFormattedTextFieldMaxPosition.getValue()).intValue());
        this.model.setMinPosition(((Number) this.jFormattedTextFieldMinPosition.getValue()).intValue());
        this.model.setMaxSpeed(((Number) this.jFormattedTextFieldMaxSpeed.getValue()).intValue());
        this.model.setMinSpeed(((Number) this.jFormattedTextFieldMinSpeed.getValue()).intValue());
        this.jCheckBoxManuallyPositionable.setSelected(this.model.isPositionable());
        this.model.setCyclesUntilReact(((Number) this.jFormattedTextFieldCyclesUntilReact.getValue()).intValue());
        this.model.setCycleError(((Number) this.jFormattedTextFieldCycleError.getValue()).intValue());
        this.model.setPositionError(((Number) this.jFormattedTextFieldPositionError.getValue()).intValue());
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

        jLabelName = new javax.swing.JLabel();
        jTextFieldName = new javax.swing.JTextField();
        jLabelNameMaxPosition = new javax.swing.JLabel();
        jLabelNameMinPosition = new javax.swing.JLabel();
        jFormattedTextFieldMaxPosition = new javax.swing.JFormattedTextField();
        jFormattedTextFieldMinPosition = new javax.swing.JFormattedTextField();
        jLabelNameMinSpeed = new javax.swing.JLabel();
        jLabelNameMaxSpeed = new javax.swing.JLabel();
        jFormattedTextFieldMaxSpeed = new javax.swing.JFormattedTextField();
        jFormattedTextFieldMinSpeed = new javax.swing.JFormattedTextField();
        jFormattedTextFieldCycleError = new javax.swing.JFormattedTextField();
        jFormattedTextFieldCyclesUntilReact = new javax.swing.JFormattedTextField();
        jLabelNameCyclesUntilReact = new javax.swing.JLabel();
        jLabelNameCycleError = new javax.swing.JLabel();
        jFormattedTextFieldPositionError = new javax.swing.JFormattedTextField();
        jLabelNamePositionError = new javax.swing.JLabel();
        jCheckBoxManuallyPositionable = new javax.swing.JCheckBox();
        jPanel1 = new javax.swing.JPanel();
        jButtonCancel = new javax.swing.JButton();
        jButtonOK = new javax.swing.JButton();
        filler1 = new javax.swing.Box.Filler(new java.awt.Dimension(0, 0), new java.awt.Dimension(0, 0), new java.awt.Dimension(32767, 0));

        setLayout(new java.awt.GridBagLayout());

        jLabelName.setLabelFor(jTextFieldName);
        jLabelName.setText("Name");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelName, gridBagConstraints);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 206;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jTextFieldName, gridBagConstraints);

        jLabelNameMaxPosition.setLabelFor(jLabelNameMaxPosition);
        jLabelNameMaxPosition.setText("Max Position");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelNameMaxPosition, gridBagConstraints);

        jLabelNameMinPosition.setLabelFor(jFormattedTextFieldMinPosition);
        jLabelNameMinPosition.setText("Min Position");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelNameMinPosition, gridBagConstraints);

        jFormattedTextFieldMaxPosition.setFormatterFactory(new javax.swing.text.DefaultFormatterFactory(new javax.swing.text.NumberFormatter(java.text.NumberFormat.getIntegerInstance())));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 206;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jFormattedTextFieldMaxPosition, gridBagConstraints);

        jFormattedTextFieldMinPosition.setFormatterFactory(new javax.swing.text.DefaultFormatterFactory(new javax.swing.text.NumberFormatter(java.text.NumberFormat.getIntegerInstance())));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 206;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jFormattedTextFieldMinPosition, gridBagConstraints);

        jLabelNameMinSpeed.setLabelFor(jFormattedTextFieldMinSpeed);
        jLabelNameMinSpeed.setText("Min Speed");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelNameMinSpeed, gridBagConstraints);

        jLabelNameMaxSpeed.setLabelFor(jFormattedTextFieldMaxSpeed);
        jLabelNameMaxSpeed.setText("Max Speed");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelNameMaxSpeed, gridBagConstraints);

        jFormattedTextFieldMaxSpeed.setFormatterFactory(new javax.swing.text.DefaultFormatterFactory(new javax.swing.text.NumberFormatter(java.text.NumberFormat.getIntegerInstance())));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 206;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jFormattedTextFieldMaxSpeed, gridBagConstraints);

        jFormattedTextFieldMinSpeed.setFormatterFactory(new javax.swing.text.DefaultFormatterFactory(new javax.swing.text.NumberFormatter(java.text.NumberFormat.getIntegerInstance())));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 206;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jFormattedTextFieldMinSpeed, gridBagConstraints);

        jFormattedTextFieldCycleError.setFormatterFactory(new javax.swing.text.DefaultFormatterFactory(new javax.swing.text.NumberFormatter(java.text.NumberFormat.getIntegerInstance())));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 206;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jFormattedTextFieldCycleError, gridBagConstraints);

        jFormattedTextFieldCyclesUntilReact.setFormatterFactory(new javax.swing.text.DefaultFormatterFactory(new javax.swing.text.NumberFormatter(java.text.NumberFormat.getIntegerInstance())));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 6;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 206;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jFormattedTextFieldCyclesUntilReact, gridBagConstraints);

        jLabelNameCyclesUntilReact.setLabelFor(jFormattedTextFieldCyclesUntilReact);
        jLabelNameCyclesUntilReact.setText("Cycles Until React");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 6;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelNameCyclesUntilReact, gridBagConstraints);

        jLabelNameCycleError.setLabelFor(jFormattedTextFieldCycleError);
        jLabelNameCycleError.setText("Cycle Error");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelNameCycleError, gridBagConstraints);

        jFormattedTextFieldPositionError.setFormatterFactory(new javax.swing.text.DefaultFormatterFactory(new javax.swing.text.NumberFormatter(java.text.NumberFormat.getIntegerInstance())));
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.ipadx = 206;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jFormattedTextFieldPositionError, gridBagConstraints);

        jLabelNamePositionError.setLabelFor(jFormattedTextFieldPositionError);
        jLabelNamePositionError.setText("Position Error");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 7;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jLabelNamePositionError, gridBagConstraints);

        jCheckBoxManuallyPositionable.setText("Manually Positionable");
        jCheckBoxManuallyPositionable.setHorizontalTextPosition(javax.swing.SwingConstants.LEADING);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 8;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jCheckBoxManuallyPositionable, gridBagConstraints);

        jPanel1.setLayout(new java.awt.GridBagLayout());

        jButtonCancel.setText("Cancel");
        jButtonCancel.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonCancelActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.SOUTHEAST;
        jPanel1.add(jButtonCancel, gridBagConstraints);

        jButtonOK.setText("OK");
        jButtonOK.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonOKActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.SOUTHEAST;
        jPanel1.add(jButtonOK, gridBagConstraints);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 2;
        gridBagConstraints.gridy = 9;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.SOUTHEAST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        add(jPanel1, gridBagConstraints);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 9;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.weighty = 1.0;
        add(filler1, gridBagConstraints);
    }// </editor-fold>//GEN-END:initComponents

    private void jButtonCancelActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonCancelActionPerformed
        this.close(false);
    }//GEN-LAST:event_jButtonCancelActionPerformed

    private void jButtonOKActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonOKActionPerformed
        this.close(true);
    }//GEN-LAST:event_jButtonOKActionPerformed

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.Box.Filler filler1;
    private javax.swing.JButton jButtonCancel;
    private javax.swing.JButton jButtonOK;
    private javax.swing.JCheckBox jCheckBoxManuallyPositionable;
    private javax.swing.JFormattedTextField jFormattedTextFieldCycleError;
    private javax.swing.JFormattedTextField jFormattedTextFieldCyclesUntilReact;
    private javax.swing.JFormattedTextField jFormattedTextFieldMaxPosition;
    private javax.swing.JFormattedTextField jFormattedTextFieldMaxSpeed;
    private javax.swing.JFormattedTextField jFormattedTextFieldMinPosition;
    private javax.swing.JFormattedTextField jFormattedTextFieldMinSpeed;
    private javax.swing.JFormattedTextField jFormattedTextFieldPositionError;
    private javax.swing.JLabel jLabelName;
    private javax.swing.JLabel jLabelNameCycleError;
    private javax.swing.JLabel jLabelNameCyclesUntilReact;
    private javax.swing.JLabel jLabelNameMaxPosition;
    private javax.swing.JLabel jLabelNameMaxSpeed;
    private javax.swing.JLabel jLabelNameMinPosition;
    private javax.swing.JLabel jLabelNameMinSpeed;
    private javax.swing.JLabel jLabelNamePositionError;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JTextField jTextFieldName;
    // End of variables declaration//GEN-END:variables
}
