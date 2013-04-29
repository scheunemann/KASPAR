package gui;

import data.Operator;
import data.Robot;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaQuery;
import javax.swing.*;
import managers.PanelManager;
import managers.ServoManager;
import managers.SessionManager;

public class MainForm extends JFrame {

    private final static long serialVersionUID = 192740l;
    private final static String version = "3.0 - Alpha";
    // We are a singleton class
    private static MainForm mainFrame;
    // Hold handles to all cards
    private List<JPanel> tabs = new ArrayList<JPanel>();
    //prevent multiple calls to Initialise() from causing problems
    private Boolean isInitialised = false;

    private MainForm() {
        this.setTitle("K A S P A R - G U I   Version: " + version);
        this.setSize(1026, 781);
    }

    public void Initialise() {
        if (!this.isInitialised) {
            Robot robot = null;

            //TODO: Not every launch is an 'interaction'
            if(SessionManager.getCurrentInteraction() != null) {
            //TODO: Handle multiple robots
                for(Robot r : SessionManager.getCurrentInteraction().getRobots()) {
                    robot = r;
                    break;
                }
            }
            
            checkInitType(data.Operator.class);
            
            GuiLogger kl = new GuiLogger();
            kl.setVisible(true);
            
            if(robot != null) {
                if (!ServoManager.allServosAvailable(robot)) {
                    GuiLogger.getLogger().log(Level.SEVERE, "Kaspar not connected or other instance still running? Can't establish connection to all servos!");
                } else {
                    ServoManager.initialiseAllServos(robot);

                    /* global layout */
                    this.getContentPane().setLayout(new BorderLayout(5, 5));
                    this.addWindowListener(new WindowAdapter() {
                        @Override
                        public void windowClosing(WindowEvent e) {
                            exitApplication(0);
                        }
                    });

                    PosePanel pp = new PosePanel(robot);
                    PanelManager.setPoseListModel(pp.getPoseListModel());

                    SequencePanel sp = new SequencePanel(robot);
                    PanelManager.setSequenceListModel(sp.getSequenceListModel());

                    // Components to go in tabbed pane
                    tabs.add(new BehaviourPanel(robot));
                    tabs.add(pp);
                    tabs.add(sp);
                    tabs.add(new KeyMapPanel());
                    tabs.add(new FsrSensorsPanel());

                    /* layout for the different lower panels */
                    JTabbedPane tabbedPane = new JTabbedPane();
                    for (JPanel p : this.tabs) {
                        tabbedPane.add(p, p.getName());
                    }

                    tabbedPane.setSelectedIndex(3);

                    /*  add panels and set visible                  */
                    this.getContentPane().add(tabbedPane, BorderLayout.CENTER);

                    // TODO imagegrabber
                    //kaspar.addImageListener(this, 20);
                    //TODO: Reconnect
                    //Servos.runUpdater(true);
                }
            }

            this.isInitialised = true;
        }
    }

    public static MainForm getInstance() {
        if (mainFrame == null) {
            GuiLogger.getLogger().log(Level.SEVERE, "Lost handle on mainFrame instance. Aborting.");
            System.exit(1);
        }

        return mainFrame;
    }

    public static void main(String argv[]) {
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
            java.util.logging.Logger.getLogger(Tester.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(Tester.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(Tester.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(Tester.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            @Override
            public void run() {
                mainFrame = new MainForm();
                mainFrame.Initialise();
                mainFrame.setVisible(true);
            }
        });
    }

    private static <T extends Object> void checkInitType(Class<T> class_) {
        EntityManager em = SessionManager.getEntityManager();

        CriteriaQuery<T> q = em.getCriteriaBuilder().createQuery(class_);
        q.select(q.from(class_));

        List<T> list = em.createQuery(q).getResultList();

        if (list.isEmpty()) {
            em.getTransaction().begin();
            T obj = getNewObject(class_);
            em.persist(obj);
            em.getTransaction().commit();
        }
    }

    private static <T extends Object> T getNewObject(Class<T> class_) {
//        try {
//            if (class_ == Operator.class) {
//                return (T) showOperatorGui(false, (Operator) class_.newInstance());
//            } else if (class_ == Robot.class) {
//                return (T) showRobotGui(false, (Robot) class_.newInstance());
//            }
//        } catch (InstantiationException ex) {
//            Logger.getLogger(MainForm.class.getName()).log(Level.SEVERE, null, ex);
//        } catch (IllegalAccessException ex) {
//            Logger.getLogger(MainForm.class.getName()).log(Level.SEVERE, null, ex);
//        }

        return null;
    }
    
    private void exitApplication(int status) {
        System.err.println("Goodbye.");
        System.exit(status);
    }
}
