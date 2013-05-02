/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui;

import java.awt.Dimension;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JPanel;

/**
 *
 * @author nathan
 */
public class animator implements Runnable {

    private java.awt.Component container;
    private int heightDiff;
    private int widthDiff;

    public animator(java.awt.Component container, Dimension change) {
        this.container = container;
    }

    public static Dimension setGetSizeChange(java.awt.Component placeHolderPanel, java.awt.Component newPanel) {
        Dimension newPanelSize = newPanel.getPreferredSize();
        Dimension oldPanelSize = placeHolderPanel.getSize();

        int height = (int) (newPanelSize.getHeight() - oldPanelSize.getHeight());
        int width = (int) (newPanelSize.getWidth() - oldPanelSize.getWidth());
        return new Dimension(width, height);
    }

    @Override
    public void run() {
        Dimension startContainerSize = container.getSize();
        container.validate();
        Dimension minContainerSize = container.getMinimumSize();

        if (startContainerSize.getHeight() + heightDiff < minContainerSize.getHeight()) {
            heightDiff = (int) (minContainerSize.getHeight() - startContainerSize.getHeight());
        }

        if (startContainerSize.getWidth() + widthDiff < minContainerSize.getWidth()) {
            widthDiff = (int) (minContainerSize.getWidth() - startContainerSize.getWidth());
        }

        // Magic numbers!
        // maxStepLength and minPixelsPerStep were adjusted arbitrarily until they 'felt' fast
        // container.update() is not a fast method, not by far
        int minPixelsPerStep = 3;
        int maxStepLength = 10;
        int maxTime = 100;

        int steps = (int) Math.max(Math.abs(heightDiff / minPixelsPerStep), Math.abs(widthDiff / minPixelsPerStep));

        if (steps > 0) {
            int time = (int) Math.min(steps * maxStepLength, maxTime);
            int stepLength = (int) Math.floor((double) time / steps);
            if (stepLength == 0) {
                steps = maxTime;
                stepLength = 1;
            }

            double yChange = (double) heightDiff / steps;
            double xChange = (double) widthDiff / steps;

            long start = java.lang.System.currentTimeMillis();
            for (int i = 1; i < steps + 1; i++) {
                int y = (int) (startContainerSize.getHeight() + (yChange * i));
                int x = (int) (startContainerSize.getWidth() + (xChange * i));

                if (i > Math.ceil(i / Math.max(Math.abs(yChange), Math.abs(xChange)))
                        && startContainerSize.equals(container.getSize())) {
                    //Container size is fixed, no animation possible
                    break;
                }

                container.setSize(x, y);
                container.validate();
                container.update(container.getGraphics());

                long spent = java.lang.System.currentTimeMillis() - start;
                long expected = (i * stepLength);
                long sleep = expected - spent;
                if (sleep > 0) {
                    try {
                        Thread.sleep(sleep);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(animator.class.getName()).log(Level.SEVERE, null, ex);
                        break;
                    }
                } else if (sleep < 0) {
                    //Running slow, catch up
                    double skip = Math.abs(sleep) / (double) stepLength;
                    i += (int) Math.ceil(skip);
                }
            }
        }

        //Clean up any remainders
        container.setSize((int) (startContainerSize.getWidth() + widthDiff), (int) (startContainerSize.getHeight() + heightDiff));
    }
}
