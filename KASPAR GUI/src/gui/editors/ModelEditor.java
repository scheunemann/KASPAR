/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;

import gui.animator;
import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;
import java.util.concurrent.Callable;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author nathan
 */
public abstract class ModelEditor<T extends Object> extends javax.swing.JPanel {

    private Container newItemHost = null;

    public abstract void commitChanges();

    public abstract T getData();

    public abstract void revertChanges();

    public abstract void setData(T operator);

    public void setNewItemHost(java.awt.Container host) {
        this.newItemHost = host;
    }

    protected void close(boolean commitChanges) {
        if (commitChanges) {
            this.commitChanges();
        } else {
            this.revertChanges();
        }

        this.setVisible(false);
    }

    protected <R extends Object> Callable<R> getCallable(final Class<R> rClass) {
        Callable<R> callNewPose = new Callable<R>() {
            @Override
            public R call() {
                return newItem(rClass);
            }
        };

        return callNewPose;
    }

    protected <R extends Object> R newItem(Class<R> rClass) {
        if (this.newItemHost == null) {
            this.newItemHost = new javax.swing.JDialog();
        }

        Object lock = new Object();
        ModelEditor<R> newItemEditor = guiHelper.getEditorPanel(rClass);
        if(newItemEditor == null) {
            Logger.getLogger(ModelEditor.class.getName()).log(Level.SEVERE, "Unable to locate editor for: {0}", rClass.getName());
            return null;
        }
        
        try {
            newItemEditor.setData(rClass.newInstance());
        } catch (InstantiationException ex) {
            Logger.getLogger(ModelEditor.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        } catch (IllegalAccessException ex) {
            Logger.getLogger(ModelEditor.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
        
        AnimatedContainerSyncroniser<R> syncroniser = new AnimatedContainerSyncroniser<R>(animator.setGetSizeChange(this.newItemHost, newItemEditor), lock);
        this.newItemHost.setLayout(new BorderLayout());
        this.newItemHost.add(newItemEditor, BorderLayout.CENTER);
        this.newItemHost.addComponentListener(syncroniser);

        synchronized (lock) {
            try {
                this.newItemHost.setVisible(true);
                
                while (this.newItemHost.isVisible()) {
                    lock.wait();
                }
            } catch (InterruptedException ex) {
                Logger.getLogger(ModelEditor.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return newItemEditor.getData();
    }

    private class AnimatedContainerSyncroniser<R extends Object> implements ComponentListener {

        private final Object lock;
        private final Dimension newDimension;

        public AnimatedContainerSyncroniser(Dimension newDimension, Object lock) {
            this.lock = lock;
            this.newDimension = newDimension;
        }

        @Override
        public void componentShown(ComponentEvent ce) {
            animator a = new animator(ce.getComponent(), newDimension);
            new Thread(a).start();
        }

        @Override
        public void componentHidden(ComponentEvent ce) {
            synchronized (this.lock) {
                lock.notify();
            }
        }

        @Override
        public void componentResized(ComponentEvent ce) {
        }

        @Override
        public void componentMoved(ComponentEvent ce) {
        }
    }
}
