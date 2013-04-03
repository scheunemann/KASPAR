/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import javax.swing.DefaultComboBoxModel;
import javax.swing.DefaultListModel;
import javax.swing.JComponent;

/**
 *
 * @author nathan
 */
public class guiHelper {

    public static <T extends Object> ModelEditor<T> getPanel(T model, Class<T> tClass) {
        if (tClass == data.Robot.class) {
            return (ModelEditor<T>) new gui.editors.Robot(null);
        }

        return null;
    }
    
    public static <T extends Object> guiComboBox<T> addComboBox(Iterable<T> items, JComponent component, int x, int y) {
        return addComboBox(items, component, x, y, null);
    }
    
    public static <T extends Object> guiComboBox<T> addComboBox(Iterable<T> items, JComponent component, int x, int y, Callable<T> newItemCallback) {
        guiComboBox<T> box;
        if (newItemCallback != null) {
            box = new guiComboBox(items, newItemCallback);
        } else {
            box = new guiComboBox(items);
        }
        java.awt.GridBagConstraints gridBagConstraints;
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = x;
        gridBagConstraints.gridy = y;
        gridBagConstraints.gridwidth = 1;
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.WEST;
        gridBagConstraints.insets = new java.awt.Insets(2, 2, 2, 2);
        component.add(box, gridBagConstraints);
        return box;
    }

    public static <T extends Object> DefaultComboBoxModel getComboBoxModel(Iterable<T> items) {
        DefaultComboBoxModel model = new DefaultComboBoxModel();

        if (items != null) {
            for (T item : items) {
                model.addElement(item);
            }
        }

        return model;
    }

    public static <T extends Object> DefaultComboBoxModel getComboBoxModel(T[] items) {
        DefaultComboBoxModel model = new DefaultComboBoxModel();

        if (items != null) {
            for (T item : items) {
                model.addElement(item);
            }
        }

        return model;
    }

    public static <T extends Object> DefaultListModel getListModel(Iterable<T> items) {
        DefaultListModel model = new DefaultListModel();
        if (items != null) {
            for (T item : items) {
                model.addElement(item);
            }
        }

        return model;
    }
}
