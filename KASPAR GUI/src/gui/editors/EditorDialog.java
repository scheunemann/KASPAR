/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;

import gui.animator;
import java.awt.*;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JLayer;
import javax.swing.JPanel;

/**
 *
 * @author nathan
 */
public class EditorDialog extends javax.swing.JDialog implements ComponentListener {

    private List<JPanel> panels;
    private JLayer<JPanel> previousPanel;
    private JLayer<JPanel> currentPanel;
    private JLayer<JPanel> nextPanel;

    /**
     * Creates new form EditorDialog
     */
    public EditorDialog() {
        super();
        initComponents();
        panels = new ArrayList<JPanel>();
        this.addComponentListener(this);
    }

    public void add(JPanel newPanel) {
        this.panels.add(newPanel);
        newPanel.addComponentListener(this);
        this.centerPanelsOn(newPanel);
    }
    
    private void centerPanelsOn(JPanel panel) {

        if (panel != this.currentPanel.getView()) {
            int prevPanelIndex = this.panels.indexOf(panel) - 1;
            int nextPanelIndex = this.panels.indexOf(panel) + 1;

            if (prevPanelIndex >= 0) {
                JPanel prev = this.panels.get(prevPanelIndex);
                this.previousPanel.setView(prev);
                this.previousPanel.setVisible(true);
            } else {
                this.previousPanel.setView(null);
                this.previousPanel.setVisible(false);
            }

            this.currentPanel.setView(panel);
            panel.requestFocus();

            if (nextPanelIndex < this.panels.size()) {
                JPanel next = this.panels.get(nextPanelIndex);
                this.nextPanel.setView(next);
                this.nextPanel.setVisible(true);
            } else {
                this.nextPanel.setView(null);
                this.nextPanel.setVisible(false);
            }

            animator a = new animator(this, animator.setGetSizeChange(this, this.currentPanel));
            new Thread(a).start();
        }
    }

    @SuppressWarnings("unchecked")
    private void initComponents() {
        setDefaultCloseOperation(javax.swing.WindowConstants.HIDE_ON_CLOSE);
        getContentPane().setLayout(new javax.swing.BoxLayout(getContentPane(), javax.swing.BoxLayout.LINE_AXIS));

        this.previousPanel = new JLayer<JPanel>();
        this.previousPanel.setGlassPane(new DisablePane());
        this.previousPanel.getGlassPane().setVisible(true);
        this.previousPanel.getGlassPane().addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                centerPanelsOn(previousPanel.getView());
            }
        });

        this.currentPanel = new JLayer<JPanel>();

        this.nextPanel = new JLayer<JPanel>();
        this.nextPanel.setGlassPane(new DisablePane());
        this.nextPanel.getGlassPane().setVisible(true);
        this.nextPanel.getGlassPane().addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                centerPanelsOn(nextPanel.getView());
            }
        });

        getContentPane().add(this.previousPanel);
        getContentPane().add(this.currentPanel);
        getContentPane().add(this.nextPanel);
    }

    @Override
    public void componentResized(ComponentEvent ce) {
    }

    @Override
    public void componentMoved(ComponentEvent ce) {
    }

    @Override
    public void componentShown(ComponentEvent ce) {
    }

    @Override
    public void componentHidden(ComponentEvent ce) {
        if (JPanel.class.isInstance(ce.getComponent())) {
            JPanel closedPanel = (JPanel) ce.getComponent();
            if (this.panels.contains(closedPanel)) {
                int index = this.panels.indexOf(closedPanel);
                while (this.panels.size() > index) {
                    JPanel temp = this.panels.remove(this.panels.size() - 1);
                    temp.setVisible(false);
                }

                if (this.panels.size() > 0) {
                    this.centerPanelsOn(this.panels.get(this.panels.size() - 1));
                } else {
                    this.setVisible(false);
                }
            }
        }
    }

    class DisablePane extends JPanel {

        public DisablePane() {
            this.setOpaque(false);
            this.addMouseListener(new MouseAdapter() {
            });
            this.addMouseMotionListener(new MouseMotionAdapter() {
            });
            this.addKeyListener(new KeyAdapter() {
            });
        }

        @Override
        public void paint(Graphics g) {
            super.paint(g);

            Graphics2D g2 = (Graphics2D) g.create();

            g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, .5f));
            g2.setPaint(Color.DARK_GRAY);
            g2.fillRect(0, 0, getWidth(), getHeight());

            g2.dispose();
        }
    }
}
