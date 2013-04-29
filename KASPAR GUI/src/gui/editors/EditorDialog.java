/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;

import gui.animator;
import java.awt.*;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;
import java.awt.event.FocusEvent;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.util.LinkedList;
import java.util.List;
import javax.swing.JComponent;
import javax.swing.JLayer;
import javax.swing.JPanel;
import javax.swing.plaf.LayerUI;

/**
 *
 * @author nathan
 */
public class EditorDialog extends javax.swing.JFrame implements ComponentListener {

    private int currentPanelIndex = -1;
    private List<JPanel> panels;
    private javax.swing.JPanel jPanelCurrent;
    private javax.swing.JPanel jPanelNext;
    private javax.swing.JPanel jPanelPrevious;

    /**
     * Creates new form EditorDialog
     */
    public EditorDialog() {
        initComponents();
        panels = new LinkedList<JPanel>();
        this.addComponentListener(this);
    }

    public void addPanel(JPanel newPanel) {
        this.panels.add(newPanel);
        newPanel.addComponentListener(this);
        this.centerPanelsOn(this.panels.size() - 1);
    }

    private void centerPanelsOn(int index) {

        if (index != currentPanelIndex) {
            this.jPanelPrevious.removeAll();
            this.jPanelCurrent.removeAll();
            this.jPanelNext.removeAll();

            int prevPanelIndex = index - 1;
            int nextPanelIndex = index + 1;

            if (prevPanelIndex >= 0) {
                JPanel prev = this.panels.get(prevPanelIndex);

                this.jPanelPrevious.add(prev);
                this.jPanelPrevious.setVisible(true);
            } else {
                this.jPanelPrevious.setVisible(false);
            }

            JPanel curr = this.panels.get(index);

            this.jPanelCurrent.add(curr);
            this.currentPanelIndex = index;

            if (nextPanelIndex < this.panels.size()) {
                JPanel next = this.panels.get(nextPanelIndex);

                this.jPanelNext.add(next);
                this.jPanelNext.setVisible(true);
            } else {
                this.jPanelNext.setVisible(false);
            }

            animator a = new animator(this, animator.setGetSizeChange(this, this.jPanelCurrent));
            new Thread(a).start();
        }
    }

    @SuppressWarnings("unchecked")
    private void initComponents() {
        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        getContentPane().setLayout(new javax.swing.BoxLayout(getContentPane(), javax.swing.BoxLayout.LINE_AXIS));

        jPanelPrevious = new javax.swing.JPanel();
        jPanelPrevious.setLayout(new java.awt.BorderLayout());
        jPanelPrevious.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                jPanelPreviousMouseClicked(evt);
            }
        });

        //getContentPane().add(jPanelPrevious);
        getContentPane().add(new JLayer<JPanel>(jPanelPrevious, new DisablePanelLayerUI()));

        jPanelCurrent = new javax.swing.JPanel();
        jPanelCurrent.setLayout(new java.awt.BorderLayout());
        getContentPane().add(jPanelCurrent);

        jPanelNext = new javax.swing.JPanel();
        jPanelNext.setLayout(new java.awt.BorderLayout());
        jPanelNext.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                jPanelNextMouseClicked(evt);
            }
        });

        //getContentPane().add(jPanelNext);
        getContentPane().add(new JLayer<JPanel>(jPanelNext, new DisablePanelLayerUI()));

        pack();
    }

    private void jPanelNextMouseClicked(java.awt.event.MouseEvent evt) {
        this.centerPanelsOn(this.currentPanelIndex + 1);
    }

    private void jPanelPreviousMouseClicked(java.awt.event.MouseEvent evt) {
        this.centerPanelsOn(this.currentPanelIndex - 1);
    }

    @Override
    public void componentResized(ComponentEvent ce) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void componentMoved(ComponentEvent ce) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void componentShown(ComponentEvent ce) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void componentHidden(ComponentEvent ce) {
        if (JPanel.class.isInstance(ce.getComponent())) {
            JPanel closedPanel = (JPanel) ce.getComponent();
            if (closedPanel == this.panels.get(this.currentPanelIndex)) {
                while (this.currentPanelIndex - 1 < this.panels.size()) {
                    //Close everything to the right
                    JPanel temp = this.panels.get(this.panels.size() - 1);
                    temp.setVisible(false);
                    this.panels.remove(this.panels.size() - 1);
                }

                if (this.currentPanelIndex > 0) {
                    this.centerPanelsOn(this.currentPanelIndex - 1);
                } else {
                    this.currentPanelIndex = -1;
                    this.setVisible(false);
                }
            }
        }
    }

    class DisablePanelLayerUI extends LayerUI<JPanel> {

        @Override
        public void paint(Graphics g, JComponent c) {
            super.paint(g, c);

            Graphics2D g2 = (Graphics2D) g.create();

            int w = c.getWidth();
            int h = c.getHeight();
            g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, .5f));
            g2.setPaint(Color.DARK_GRAY);
            g2.fillRect(0, 0, w, h);

            g2.dispose();
        }

        public void installUI(JComponent c) {
            super.installUI(c);
            JLayer l = (JLayer) c;
            l.setLayerEventMask(AWTEvent.KEY_EVENT_MASK | AWTEvent.MOUSE_EVENT_MASK);
        }

        public void uninstallUI(JComponent c) {
            super.uninstallUI(c);
            JLayer l = (JLayer) c;
            l.setLayerEventMask(0);
        }

        @Override
        protected void processKeyEvent(KeyEvent e, JLayer<? extends JPanel> l) {
            ((InputEvent) e).consume();
        }

        @Override
        protected void processMouseEvent(MouseEvent e, JLayer<? extends JPanel> l) {
            ((InputEvent) e).consume();
        }
    }
}
