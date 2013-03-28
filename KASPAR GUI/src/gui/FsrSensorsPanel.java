/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * KasparFsrSensorsPanel.java
 *
 * Created on 10-Aug-2011, 15:43:52
 */
package gui;

import sensors.fsr.FsrSerialReader;
import gnu.io.CommPortIdentifier;
import java.awt.event.*;
import java.util.Enumeration;
import javax.swing.Timer;
import managers.SessionManager;

public class FsrSensorsPanel extends javax.swing.JPanel {
    //private fsrPanel panel;

    private FsrSerialReader ArduinoBoard;
    private boolean blnConnectionOpen = false;
    private String Hz, ByteS;
    private boolean blnFilterOn = false;
    private String[] fsrNames = new String[]{
        "",
        "Left Torso",
        "Right Wristle Left",
        "Left Wristle Left",
        "Right Elbow",
        "Left Foot Down",
        "Right Arm Right",
        "Left Arm Right",
        "Right Foot Up",
        "Left Head",
        "Right Hand Outside",
        "Left Hand Outside",
        "Right Stomach",
        "",
        "Rigth Thumb",
        "Left Thumb",
        "Rigth Head",
        "Left Foot Up",
        "Right Arm Left",
        "Left Arm Left",
        "Right Foot Down",
        "Left Elbow",
        "Right Hand Inside",
        "Left Hand Inside",
        "",
        "Left Stomach",
        "Right Writstle Right",
        "Left Wristle Right",
        "Right Torso"};
    private int[] fsrValues = new int[this.fsrNames.length];
    private FsrPanel[] fsrPanels = new FsrPanel[this.fsrNames.length];

    public FsrSensorsPanel() {
        initComponents();
        loadPanels();        
        if (!SessionManager.getDebugMode()) {
            ArduinoBoard = new FsrSerialReader();

            //Here we get the ports availables and send them to the cbxPort
            Enumeration portEnum = ArduinoBoard.getPortAvailable(); //We get all the ports
            if (portEnum == null) {
                GuiLogger.getLogger().warning(
                        "Could not find ports for the Arduino Board.  Skipping initialisation.");
                this.setEnabled(false);
                return;
            }

            // iterate through, looking for the port
            while (portEnum.hasMoreElements()) {
                CommPortIdentifier currPortId = (CommPortIdentifier) portEnum.nextElement();
                cbxPort.addItem(currPortId.getName());
            }

            cbxPort.setSelectedIndex(0);

            //Here we launch the timer1 to refresh the progressbars  
            int delay1 = 30; //milliseconds
            ActionListener taskPerformer1 = new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent evt) {
                    //...Perform a task...
                    //pbTest.setValue(ArduinoBoard.getFsrValue(8));
                    //First Implement the filter
                    if (blnFilterOn) {
                        for (int i = 0; i < fsrNames.length; i++) {
                            fsrValues[i] = ArduinoBoard.getFsrFilterValue(i);
                        }
                    } else {
                        for (int i = 0; i < fsrNames.length; i++) {
                            fsrValues[i] = ArduinoBoard.getFsrRawValue(i);
                        }
                    }
                    
                    for(int i = 0; i < fsrNames.length; i++) {
                        FsrPanel p = fsrPanels[i];
                        if(p != null) {
                            p.setValue(fsrValues[i]);
                        }
                    }
                }
            };
            new Timer(delay1, taskPerformer1).start();

            //Here we launch the timer2 to control the speed of the connection
            int delay2 = 1000; //milliseconds
            ActionListener taskPerformer2 = new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent evt) {
                    //...Perform a task...
                    Hz = Integer.toString(ArduinoBoard.getCounterValue());
                    // Hz=Integer.toString(ArduinoBoard.counter);
                    txtHz.setText(Hz);
                    ArduinoBoard.resetCounterValue();
                    //ArduinoBoard.counter=0;
                    ByteS = Integer.toString(ArduinoBoard.getCounter2Value());
                    //String ByteS=Integer.toString(ArduinoBoard.counter2);
                    txtByteS.setText(ByteS);
                    ArduinoBoard.resetCounter2Value();
                    //ArduinoBoard.counter2=0;

                }
            };
            new Timer(delay2, taskPerformer2).start();
        }

    }
    
    private void loadPanels() {
        for(int i = 0; i < this.fsrNames.length; i++) {
            String name = fsrNames[i];
            if("".equals(name)) {
                continue;
            }
            
            FsrPanel p = new FsrPanel();
            p.setTitle(name);
            this.fsrPanels[i] = p;
            this.pnlSensors.add(p);
        }
    }

    /**
     * This method is called from within the constructor to initialise the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        pnlSensors = new javax.swing.JPanel();
        jPanel3 = new javax.swing.JPanel();
        pnlPort = new javax.swing.JPanel();
        cbxPort = new javax.swing.JComboBox();
        jLabel1 = new javax.swing.JLabel();
        pnlConnection = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        btnConnection = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        txtHz = new javax.swing.JTextField();
        txtByteS = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        jPanel1 = new javax.swing.JPanel();
        jLabel6 = new javax.swing.JLabel();
        btnAutoTune = new javax.swing.JButton();
        btnFilterOn = new javax.swing.JToggleButton();
        jButton1 = new javax.swing.JButton();
        jLabel7 = new javax.swing.JLabel();

        setName("Fsr Sensors"); // NOI18N
        setPreferredSize(new java.awt.Dimension(800, 600));
        setLayout(new java.awt.BorderLayout());
        add(pnlSensors, java.awt.BorderLayout.CENTER);

        pnlPort.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 0, 0)));

        cbxPort.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cbxPortActionPerformed(evt);
            }
        });

        jLabel1.setFont(new java.awt.Font("Tahoma", 1, 13)); // NOI18N
        jLabel1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel1.setLabelFor(cbxPort);
        jLabel1.setText("Select Port");

        javax.swing.GroupLayout pnlPortLayout = new javax.swing.GroupLayout(pnlPort);
        pnlPort.setLayout(pnlPortLayout);
        pnlPortLayout.setHorizontalGroup(
            pnlPortLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlPortLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(pnlPortLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlPortLayout.createSequentialGroup()
                        .addComponent(jLabel1)
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addComponent(cbxPort, javax.swing.GroupLayout.Alignment.TRAILING, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );
        pnlPortLayout.setVerticalGroup(
            pnlPortLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlPortLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 21, Short.MAX_VALUE)
                .addComponent(cbxPort, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );

        pnlConnection.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 0, 0)));
        pnlConnection.setMaximumSize(new java.awt.Dimension(116, 84));
        pnlConnection.setMinimumSize(new java.awt.Dimension(116, 84));

        jLabel2.setFont(new java.awt.Font("Tahoma", 1, 13)); // NOI18N
        jLabel2.setText("Connection");

        btnConnection.setText("Open");
        btnConnection.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnConnectionActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout pnlConnectionLayout = new javax.swing.GroupLayout(pnlConnection);
        pnlConnection.setLayout(pnlConnectionLayout);
        pnlConnectionLayout.setHorizontalGroup(
            pnlConnectionLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlConnectionLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(pnlConnectionLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel2)
                    .addComponent(btnConnection, javax.swing.GroupLayout.PREFERRED_SIZE, 82, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        pnlConnectionLayout.setVerticalGroup(
            pnlConnectionLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlConnectionLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 19, Short.MAX_VALUE)
                .addComponent(btnConnection)
                .addContainerGap())
        );

        jPanel2.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 0, 0)));

        jLabel3.setFont(new java.awt.Font("Tahoma", 1, 13)); // NOI18N
        jLabel3.setText("Connection Speed");

        jLabel4.setLabelFor(txtHz);
        jLabel4.setText("Hz");

        jLabel5.setLabelFor(txtByteS);
        jLabel5.setText("byte/s");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addComponent(txtHz, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel4)
                        .addGap(18, 18, 18)
                        .addComponent(txtByteS, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(jLabel5)
                        .addContainerGap())
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addComponent(jLabel3)
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel3)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 21, Short.MAX_VALUE)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtHz, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(txtByteS, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel4)
                    .addComponent(jLabel5))
                .addContainerGap())
        );

        jPanel1.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 0, 0)));

        jLabel6.setFont(new java.awt.Font("Tahoma", 1, 13)); // NOI18N
        jLabel6.setText("Filter");

        btnAutoTune.setText("AutoTune");
        btnAutoTune.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnAutoTuneActionPerformed(evt);
            }
        });

        btnFilterOn.setText("On");
        btnFilterOn.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnFilterOnActionPerformed(evt);
            }
        });

        jButton1.setText("Reset");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(jLabel6)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jButton1))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(btnAutoTune)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(btnFilterOn)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jButton1)
                    .addComponent(jLabel6))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(btnAutoTune)
                    .addComponent(btnFilterOn))
                .addContainerGap())
        );

        jLabel7.setText("Advice: Go to another tab and return if the connection speed is not close to 30 Hz");

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addComponent(pnlPort, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(pnlConnection, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel7))
                .addContainerGap(165, Short.MAX_VALUE))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(pnlConnection, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(pnlPort, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel7)
                .addContainerGap())
        );

        add(jPanel3, java.awt.BorderLayout.PAGE_START);
    }// </editor-fold>//GEN-END:initComponents

    private void cbxPortActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cbxPortActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_cbxPortActionPerformed

    private void btnConnectionActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnConnectionActionPerformed
        // TODO add your handling code here:
        if (blnConnectionOpen) {
            ArduinoBoard.close();
            blnConnectionOpen = false;
            btnConnection.setText("Open");
        } else {
            ArduinoBoard.setPortName((String) cbxPort.getSelectedItem());
            ArduinoBoard.initialize();
            blnConnectionOpen = true;
            btnConnection.setText("Close");
        }
    }//GEN-LAST:event_btnConnectionActionPerformed

    private void btnAutoTuneActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnAutoTuneActionPerformed
        ArduinoBoard.autoTune();
    }//GEN-LAST:event_btnAutoTuneActionPerformed

    private void btnFilterOnActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnFilterOnActionPerformed
        // TODO add your handling code here:
        if (blnFilterOn) {
            blnFilterOn = false;
        } else {
            blnFilterOn = true;
        }
    }//GEN-LAST:event_btnFilterOnActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        // TODO add your handling code here:
        ArduinoBoard.resetFilter();
    }//GEN-LAST:event_jButton1ActionPerformed

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton btnAutoTune;
    private javax.swing.JButton btnConnection;
    private javax.swing.JToggleButton btnFilterOn;
    private javax.swing.JComboBox cbxPort;
    private javax.swing.JButton jButton1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel pnlConnection;
    private javax.swing.JPanel pnlPort;
    private javax.swing.JPanel pnlSensors;
    private javax.swing.JTextField txtByteS;
    private javax.swing.JTextField txtHz;
    // End of variables declaration//GEN-END:variables
}
