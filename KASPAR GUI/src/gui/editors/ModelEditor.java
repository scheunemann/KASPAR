/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui.editors;

/**
 *
 * @author nathan
 */
public interface ModelEditor<T extends Object> {

    void commitChanges();

    T getData();

    void revertChanges();

    void setData(T operator);    
}
