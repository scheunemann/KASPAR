/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package managers;

import data.GUIButton;
import data.Interaction;
import data.Pose;
import data.Robot;
import data.Sequence;
import data.Servo;
import data.ServoConfig;
import data.ServoGroup;
import data.ServoPosition;
import data.User;
import gui.GuiLogger;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.criteria.CriteriaQuery;

/**
 *
 * @author nathan
 */
public class SessionManager {

    private static Interaction interaction;
    private static EntityManagerFactory emf;
    
    public static EntityManager getEntityManager() {
        return getEntityManagerFactory().createEntityManager();
    }
    
    private static EntityManagerFactory getEntityManagerFactory() {
        if(emf == null) {
            emf = Persistence.createEntityManagerFactory("robotActions");
        }
        
        return emf;
    }

    public static Servo getServo(Robot robot, String servoName) {
        for (ServoGroup sg : robot.getServoGroups()) {
            for (Servo s : sg.getServos()) {
                if (s.getName() == null ? servoName == null : s.getName().equals(servoName)) {
                    return s;
                }
            }
        }

        GuiLogger.getLogger().log(Level.SEVERE, "Servo '{0}' does not exist on Robot '{1}'.", new Object[]{robot.getName(), servoName});
        //TODO: Handle exception
        return null;
    }

    public static ServoConfig getServoConfig(Robot robot, String servoTypeName) {
        for (ServoConfig sc : robot.getServoConfigs()) {
            if (sc.getServoType().getName() == null ? servoTypeName == null : sc.getServoType().getName().equals(servoTypeName)) {
                return sc;
            }
        }

        GuiLogger.getLogger().log(Level.SEVERE, "ServoConfig '{0}' does not exist for Robot '{1}'.", new Object[]{robot.getName(), servoTypeName});
        //TODO: Handle exception
        return null;
    }
    
    public static <T extends Object> Collection<T> getAll(Class<T> tClass) {
        EntityManager em = getEntityManager();
        CriteriaQuery<T> q = em.getCriteriaBuilder().createQuery(tClass);
        q.select(q.from(tClass));

        return em.createQuery(q).getResultList();
    }

    public static void setCurrentInteraction(Interaction currentInteraction) {
        interaction = currentInteraction;
    }

    public static Interaction getCurrentInteraction() {
        return interaction;
    }

    public static Collection<Pose> getValidPoses(Robot robot) {
        Set<Pose> validPoses = new HashSet<Pose>(0);
        Map<String, Servo> robotServos = new HashMap<String, Servo>();
        for (ServoGroup sg : robot.getServoGroups()) {
            for (Servo s : sg.getServos()) {
                if (!robotServos.containsKey(s.getName())) {
                    robotServos.put(s.getName(), s);
                }
            }
        }

        for (Pose p : getAll(Pose.class)) {
            Boolean valid = true;
            for (ServoPosition s : p.getServoPositions()) {
                if (!robotServos.containsKey(s.getServoName())) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                validPoses.add(p);
            }
        }

        return validPoses;
    }

    public static Collection<Sequence> getCurrentSequences() {
        Set<Sequence> sequences = new HashSet<Sequence>();

        for (User u : interaction.getUsers()) {
            for (GUIButton b : u.getButtons()) {
                sequences.add(b.getSequence());
            }
        }

        return sequences;
    }

    public static String getSoundFolder() {
        return "";
    }

    public static void save(Object persistantObject) {
    }

    public static void delete(Object persistantObject) {
    }

    public static void reload(Sequence oldSequence) {
    }

    public static boolean isModified(Object persistantObject) {
        return true;
    }

    public static boolean getDebugMode() {
        return true;
    }
}
