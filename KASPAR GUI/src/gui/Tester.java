/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui;

import gui.editors.EditorDialog;
import gui.editors.ModelEditor;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.util.ArrayList;
import javax.swing.JPanel;

/**
 *
 * @author nathan
 */
public class Tester extends javax.swing.JFrame {

    java.util.Stack<Dimension> sizeStack = new java.util.Stack<Dimension>();
    java.util.Stack<JPanel> panelStack = new java.util.Stack<JPanel>();
    
    /**
     * Creates new form Tester
     */
    public Tester() {
        initComponents();
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jButtonOperator = new javax.swing.JButton();
        current = new javax.swing.JPanel();
        jButtonServo = new javax.swing.JButton();
        jButtonRobot = new javax.swing.JButton();
        jButton4 = new javax.swing.JButton();
        jButtonServoType = new javax.swing.JButton();
        jButtonServoGroup = new javax.swing.JButton();
        flyOut = new javax.swing.JPanel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        jButtonOperator.setText("Operator");
        jButtonOperator.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonOperatorActionPerformed(evt);
            }
        });

        current.setBackground(new java.awt.Color(228, 159, 90));

        javax.swing.GroupLayout currentLayout = new javax.swing.GroupLayout(current);
        current.setLayout(currentLayout);
        currentLayout.setHorizontalGroup(
            currentLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 0, Short.MAX_VALUE)
        );
        currentLayout.setVerticalGroup(
            currentLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 115, Short.MAX_VALUE)
        );

        jButtonServo.setText("Servo");
        jButtonServo.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonServoActionPerformed(evt);
            }
        });

        jButtonRobot.setText("Robot");
        jButtonRobot.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonRobotActionPerformed(evt);
            }
        });

        jButton4.setText("jButton4");

        jButtonServoType.setText("ServoType");
        jButtonServoType.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonServoTypeActionPerformed(evt);
            }
        });

        jButtonServoGroup.setText("ServoGroup");
        jButtonServoGroup.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonServoGroupActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout flyOutLayout = new javax.swing.GroupLayout(flyOut);
        flyOut.setLayout(flyOutLayout);
        flyOutLayout.setHorizontalGroup(
            flyOutLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 0, Short.MAX_VALUE)
        );
        flyOutLayout.setVerticalGroup(
            flyOutLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 0, Short.MAX_VALUE)
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(jButtonOperator)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jButtonRobot)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jButton4)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jButtonServoType)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jButtonServoGroup)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jButtonServo))
                    .addComponent(current, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(0, 0, 0)
                .addComponent(flyOut, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButtonRobot)
                    .addComponent(jButtonOperator)
                    .addComponent(jButton4)
                    .addComponent(jButtonServoType)
                    .addComponent(jButtonServoGroup)
                    .addComponent(jButtonServo))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(current, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
            .addComponent(flyOut, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButtonOperatorActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonOperatorActionPerformed
        // TODO add your handling code here:

        ArrayList<data.User> users = new ArrayList<data.User>();
        users.add(new data.User("Test 1"));
        users.add(new data.User("Test 2"));
        users.add(new data.User("Test 3"));
        users.add(new data.User("Test 4"));
        data.Operator op = new data.Operator();
        op.getUsers().add(users.get(2));
        
        gui.editors.Operator o = new gui.editors.Operator(users);
        o.setData(op);
        
        switchPannel(o);
    }//GEN-LAST:event_jButtonOperatorActionPerformed
    
    private EditorDialog dialog = null;
    
    private void switchPannel(ModelEditor<?> newPanel) {
        if(dialog == null) {
            dialog = new EditorDialog();
            dialog.setVisible(true);
            dialog.setSize(newPanel.getPreferredSize());
        }
        
        dialog.addPanel(newPanel);
    }
    
    private void jButtonRobotActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonRobotActionPerformed
        // TODO add your handling code here:
        data.Robot op = new data.Robot();
        gui.editors.Robot o = new gui.editors.Robot(new ArrayList<data.Pose>());
        o.setData(op);
        
        switchPannel(o);
    }//GEN-LAST:event_jButtonRobotActionPerformed
    
    private void jButtonServoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonServoActionPerformed
        // TODO add your handling code here:
        data.Servo op = new data.Servo();
        gui.editors.Servo o = new gui.editors.Servo(new ArrayList<data.ServoGroup>());
        o.setData(op);
        
        switchPannel(o);
    }//GEN-LAST:event_jButtonServoActionPerformed
    
    private void jButtonServoTypeActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonServoTypeActionPerformed
        data.ServoType op = new data.ServoType();
        gui.editors.ServoType o = new gui.editors.ServoType();
        o.setData(op);
        
        switchPannel(o);
    }//GEN-LAST:event_jButtonServoTypeActionPerformed
    
    private void jButtonServoGroupActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonServoGroupActionPerformed
        data.ServoGroup op = new data.ServoGroup();
        gui.editors.ServoGroup o = new gui.editors.ServoGroup(new ArrayList<data.Robot>());
        o.setData(op);
        
        switchPannel(o);
    }//GEN-LAST:event_jButtonServoGroupActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                    
                    
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(Tester.class
                    .getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(Tester.class
                    .getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(Tester.class
                    .getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(Tester.class
                    .getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new Tester().setVisible(true);
            }
        });
    }
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel current;
    private javax.swing.JPanel flyOut;
    private javax.swing.JButton jButton4;
    private javax.swing.JButton jButtonOperator;
    private javax.swing.JButton jButtonRobot;
    private javax.swing.JButton jButtonServo;
    private javax.swing.JButton jButtonServoGroup;
    private javax.swing.JButton jButtonServoType;
    // End of variables declaration//GEN-END:variables
}
