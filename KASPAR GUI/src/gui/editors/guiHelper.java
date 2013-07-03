/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;

import gui.GuiLogger;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.util.concurrent.Callable;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.DefaultComboBoxModel;
import javax.swing.DefaultListModel;
import javax.swing.JComponent;
import managers.SessionManager;

/**
 *
 * @author nathan
 */
public class guiHelper {

    private static EditorDialog modelEditor = null;

    public static <T extends Object> T getNewObject(Class<T> class_) {
        try {
            if (modelEditor == null) {
                modelEditor = new EditorDialog();
                modelEditor.setModal(true);
            }

            ModelEditor<T> editor = guiHelper.getEditorPanel(class_.newInstance());
            if (editor == null) {
                Logger.getLogger(ModelEditor.class.getName()).log(Level.SEVERE, "Unable to locate editor for: {0}", class_.getName());
                return null;
            }

            T model;
            final Object lock = new Object();
            synchronized (lock) {
                modelEditor.add(editor);
                modelEditor.setVisible(true);
                editor.addComponentListener(new ComponentAdapter() {
                    @Override
                    public void componentHidden(ComponentEvent ce) {
                        synchronized (lock) {
                            lock.notify();
                        }
                    }
                });

                while (editor.isVisible()) {
                    lock.wait();
                }

                model = editor.getModel();
            }

            SessionManager.add(model);
            return model;
        } catch (InterruptedException ex) {
            Logger.getLogger(guiHelper.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            GuiLogger.getLogger().log(Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            GuiLogger.getLogger().log(Level.SEVERE, null, ex);
        }

        return null;
    }

    public static <T extends Object> ModelEditor<T> getEditorPanel(Class<T> tClass) {
        ModelEditor<?> editor = null;

        if (data.Robot.class == tClass) {
            editor = new gui.editors.Robot(managers.SessionManager.getAll(data.Pose.class), managers.RobotManager.getDefaultRobots());
        } else if (data.Operator.class == tClass) {
            editor = new gui.editors.Operator(managers.SessionManager.getAll(data.User.class));
        } else if (data.Servo.class == tClass) {
            editor = new gui.editors.Servo(managers.SessionManager.getAll(data.ServoGroup.class));
        } else if (data.ServoGroup.class == tClass) {
            editor = new gui.editors.ServoGroup(managers.SessionManager.getAll(data.Robot.class));
        } else if (data.ServoType.class == tClass) {
            editor = new gui.editors.ServoType();
        } else if (data.Pose.class == tClass) {
            editor = new gui.editors.Pose();
        }

        if (editor != null) {
            return (ModelEditor<T>) editor;
        }

        return null;
    }

    public static <T extends Object> ModelEditor<T> getEditorPanel(T model) {
        ModelEditor<T> editor = getEditorPanel((Class<T>) model.getClass());
        editor.setModel(model);
        return editor;
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
