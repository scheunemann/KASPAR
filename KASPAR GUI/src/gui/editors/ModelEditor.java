/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;

import java.util.concurrent.Callable;

/**
 *
 * @author nathan
 */
public abstract class ModelEditor<T extends Object> extends javax.swing.JPanel {

    protected T model;

    public abstract void commitChanges();

    public abstract void revertChanges();

    public T getModel() {
        return this.model;
    }
    
    public void setModel(T data) {
        this.model = data;
        this.revertChanges();
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
        Callable<R> callable = new Callable<R>() {
            @Override
            public R call() {
                return guiHelper.getNewObject(rClass);
            }
        };

        return callable;
    }
}
