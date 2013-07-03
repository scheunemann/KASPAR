/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos;

import java.beans.PropertyChangeListener;

/**
 *
 * @author Sven
 */
public abstract class Servo {

    protected java.beans.PropertyChangeSupport propertyChangeSupport = new java.beans.PropertyChangeSupport(this);
    protected boolean continuousUpdate = false;
    protected int minPos;
    protected int maxPos;
    protected int defaultPos;
    protected int minSpeed;
    protected int maxSpeed;
    protected int defaultSpeed;
    protected String port;
    protected int portSpeed;
    protected double posScaleValue;
    protected double speedScaleValue;
    protected int targetPosition;
    protected int externalId;

    public Servo(
            String port,
            int portSpeed,
            int externalId,
            int minPos,
            int maxPos,
            int defaultPos,
            double posScaleValue,
            int minSpeed,
            int maxSpeed,
            int defaultSpeed,
            double speedScaleValue) {
        this(port, portSpeed, externalId, posScaleValue, speedScaleValue);
        this.minPos = minPos;
        this.maxPos = maxPos;
        this.defaultPos = defaultPos;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
        this.defaultSpeed = defaultSpeed;
    }

    public Servo(String port, int portSpeed, int externalId, double posScaleValue, double speedScaleValue) {
        this.port = port;
        this.speedScaleValue = speedScaleValue;
        this.posScaleValue = posScaleValue;
        this.portSpeed = portSpeed;
        this.externalId = externalId;
    }

    public void setContinuousUpdate(boolean continuousUpdate) {
        this.continuousUpdate = continuousUpdate;
    }

    public boolean setPosition(int target) {
        return setPosition(target, this.defaultSpeed);
    }
    
    public abstract int getPosition();

    public abstract boolean setPosition(int target, int speed);

    public abstract boolean checkPosition(int pos);

    public abstract void init();

    public abstract boolean isReady();

    public abstract boolean isConnected();

    public abstract void delayPosition(int target, int speed);

    public abstract void execute();

    public abstract boolean ping();
    
    public boolean hasContinuousUpdates() {
        return this.continuousUpdate;
    }
    
    public void setContinuousUpdates(boolean continuousUpdates) {
        this.propertyChangeSupport.firePropertyChange("continuousUpdate", this.continuousUpdate, this.continuousUpdate = continuousUpdates);
    }

    public int scaleToRealPos(int value) {
        if (minPos <= maxPos) {
            return (int) Math.round(minPos + (maxPos - minPos) * value / this.posScaleValue);
        } else {
            return (int) Math.round(minPos - (minPos - maxPos) * value / this.posScaleValue);
        }
    }

    public int scaleToRealSpeed(int value) {
        if (minPos <= maxPos) {
            return (int) Math.round(minSpeed + (maxSpeed - minSpeed) * value / this.speedScaleValue);
        } else {
            return (int) Math.round(minSpeed - (minSpeed - maxSpeed) * value / this.speedScaleValue);
        }
    }

    protected static int checkRange(int val, int minVal, int maxVal) {
        if (val < minVal) {
            val = minVal;
        }

        if (val > maxVal) {
            val = maxVal;
        }

        return val;
    }

    protected int realToScalePos(int value) {
        int scaled = (int) Math.round((double) (value - minPos) / (double) (maxPos - minPos) * posScaleValue);

        if (scaled < 0) {
            scaled = 0;
        }
        if (scaled > posScaleValue) {
            scaled = (int) posScaleValue;
        }
        return scaled;
    }

    protected int realToScaleSpeed(int value) {
        int scaled = (int) Math.round((double) (value - minSpeed) / (double) (maxSpeed - minSpeed) * speedScaleValue);

        if (scaled < 0) {
            scaled = 0;
        }
        if (scaled > speedScaleValue) {
            scaled = (int) speedScaleValue;
        }
        return scaled;
    }
    
    public void addPropertyChangeListener(String propertyName, PropertyChangeListener listener) {
        propertyChangeSupport.addPropertyChangeListener(propertyName, listener);
    }

    public void addPropertyChangeListener(PropertyChangeListener listener) {
        propertyChangeSupport.addPropertyChangeListener(listener);
    }

    public void removePropertyChangeListener(java.beans.PropertyChangeListener listener) {
        propertyChangeSupport.removePropertyChangeListener(listener);
    }

    public void removePropertyChangeListener(String propertyName, PropertyChangeListener listener) {
        propertyChangeSupport.removePropertyChangeListener(propertyName, listener);
    }
}
