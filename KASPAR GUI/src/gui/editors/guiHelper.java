/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;

import javax.swing.DefaultComboBoxModel;
import javax.swing.DefaultListModel;

/**
 *
 * @author nathan
 */
public class guiHelper {

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
