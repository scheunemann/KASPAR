/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.SimpleFormatter;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "ApplicationLogs")
public class ApplicationLog implements java.io.Serializable {

    private DateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    private Integer logId;
    private Interaction interaction;
    private Date time;
    private ApplicationLog.LogLevel level;
    private String className;
    private String methodName;
    private String message;
    protected PropertyChangeSupport propertyChanged;

    public enum LogLevel {

        Error,
        Warning,
        Info,
        All,
        None;

        static ApplicationLog.LogLevel fromLevel(Level level) {
            if (level == Level.ALL) {
                return ApplicationLog.LogLevel.All;
            } else if (level == Level.SEVERE) {
                return ApplicationLog.LogLevel.Error;
            } else if (level == Level.WARNING) {
                return ApplicationLog.LogLevel.Warning;
            } else if (level == Level.INFO) {
                return ApplicationLog.LogLevel.Info;
            } else if (level == Level.ALL) {
                return ApplicationLog.LogLevel.All;
            } else {
                return ApplicationLog.LogLevel.None;
            }
        }

        public Level toLevel() {
            if (this == ApplicationLog.LogLevel.All) {
                return Level.ALL;
            } else if (this == ApplicationLog.LogLevel.Error) {
                return Level.SEVERE;
            } else if (this == ApplicationLog.LogLevel.Warning) {
                return Level.WARNING;
            } else if (this == ApplicationLog.LogLevel.Info) {
                return Level.INFO;
            } else if (this == ApplicationLog.LogLevel.All) {
                return Level.ALL;
            } else {
                return Level.OFF;
            }
        }

        @Override
        public String toString() {
            switch (this) {
                case None:
                    return "None";
                case Error:
                    return "Errors only";
                case Warning:
                    return "Warnings and Errors";
                case Info:
                    return "Information, Warnings and Errors";
                case All:
                    return "All";
                default:
                    return name();
            }
        }
    }

    public ApplicationLog() {
        this.propertyChanged = new PropertyChangeSupport(this);
    }

    public ApplicationLog(Interaction interaction, Date time, String className, String methodName, ApplicationLog.LogLevel level, String message) {
        this();
        this.interaction = interaction;
        this.time = time;
        this.className = className;
        this.methodName = methodName;
        this.level = level;
        this.message = message;
    }

    public ApplicationLog(LogRecord record) {
        this(null,
                new Date(record.getMillis()),
                record.getSourceClassName(),
                record.getSourceMethodName(),
                ApplicationLog.LogLevel.fromLevel(record.getLevel()),
                new SimpleFormatter().formatMessage(record));
    }

    @Override
    public String toString() {
        String levelTxt = this.level != null ? this.level.name() : "Unknown";
        String dateTxt = this.time != null ? df.format(time) : "Unknown";
        return dateTxt + '\t'
                + className + '\t'
                + methodName + '\t'
                + levelTxt + '\t'
                + this.message + '\n';
    }

    public String toShortString() {
        return df.format(this.time) + " " + this.message + "\n";
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LogId", unique = true, nullable = false)
    public Integer getLogId() {
        return this.logId;
    }

    public void setLogId(Integer logId) {
        this.propertyChanged.firePropertyChange("logId", this.logId, this.logId = logId);
    }

    @Enumerated
    @Column(name = "LogLevel", nullable = false)
    public ApplicationLog.LogLevel getLevel() {
        return this.level;
    }

    public void setLevel(ApplicationLog.LogLevel type) {
        this.propertyChanged.firePropertyChange("level", this.level, this.level = type);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "InteractionId", nullable = false)
    public Interaction getInteraction() {
        return this.interaction;
    }

    public void setInteraction(Interaction interaction) {
        this.propertyChanged.firePropertyChange("interaction", this.interaction, this.interaction = interaction);
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "LogTime", nullable = false, length = 19)
    public Date getTime() {
        return this.time;
    }

    public void setTime(Date time) {
        this.propertyChanged.firePropertyChange("time", this.time, this.time = time);
    }

    public synchronized void addPropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.addPropertyChangeListener(propertyName, changeListener);
    }

    public synchronized void removePropertyChangeListener(String propertyName, PropertyChangeListener changeListener) {
        this.propertyChanged.removePropertyChangeListener(propertyName, changeListener);
    }
}
