/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package managers;

import data.Robot;
import data.Servo;
import data.ServoConfig;
import data.ServoGroup;
import java.io.IOException;
import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 *
 * @author nathan
 */
public class RobotManager {

    public static HashMap<String, data.Robot> getDefaultRobots() {
        HashMap<String, data.Robot> robots = new HashMap<String, Robot>();
        robots.put("Kaspar 1a", parseKasparFile("/home/nathan/Downloads/kaspar/Kaspar1a.xml"));
        robots.put("Kaspar 1b", parseKasparFile("/home/nathan/Downloads/kaspar/Kaspar1c.xml"));
        robots.put("Kaspar 1c", parseKasparFile("/home/nathan/Downloads/kaspar/Kaspar1b.xml"));
        return robots;
    }

    private static data.Robot parseKasparFile(String xmlFilePath) {
        try {
            Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(new InputSource(xmlFilePath));

            data.Robot r = new data.Robot();
            r.setName(getString("/KASPAR/NAME", doc, "KASPAR"));
            r.setVersion(getString("/KASPAR/@version", doc, ""));
            r.setServoConfigs(getServoConfigs(doc));
            r.setServoGroups(getServoGroups(doc));
            return r;

        } catch (ParserConfigurationException ex) {
            Logger.getLogger(RobotManager.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SAXException ex) {
            Logger.getLogger(RobotManager.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(RobotManager.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    private static String getString(String xpath, Node doc, String defaultValue) {
        XPath xPath = XPathFactory.newInstance().newXPath();
        try {
            String value = xPath.evaluate(xpath, doc);
            if("".equals(value) || value == null) {
                return defaultValue;
            }
            
            return value;
        } catch (XPathExpressionException ex) {
            return defaultValue;
        }
    }

    private static NodeList getNodeList(String xpath, Node doc) {
        XPath xPath = XPathFactory.newInstance().newXPath();
        try {
            return (NodeList) xPath.evaluate(xpath, doc, javax.xml.xpath.XPathConstants.NODESET);
        } catch (XPathExpressionException ex) {
            return new NodeList() {
                @Override
                public Node item(int i) {
                    return null;
                }

                @Override
                public int getLength() {
                    return 0;
                }
            };
        }
    }

    private static Node getNode(String xpath, Node doc) {
        XPath xPath = XPathFactory.newInstance().newXPath();
        try {
            return (Node) xPath.evaluate(xpath, doc, javax.xml.xpath.XPathConstants.NODE);
        } catch (XPathExpressionException ex) {
            return null;
        }
    }

    private static Set<ServoConfig> getServoConfigs(Node doc) {
        Set<ServoConfig> configs = new HashSet<ServoConfig>();
        String[] configNames = {"AX12", "SSC32", "MINISSC"};

        for (String configName : configNames) {
            ServoConfig config = getServoConfig(doc, configName);
            if (config != null) {
                configs.add(config);
            }
        }

        return configs;
    }

    private static ServoConfig getServoConfig(Node doc, String servoName) {
        Node configNode = getNode("/KASPAR/" + servoName, doc);
        if (configNode == null) {
            return null;
        }

        ServoConfig c = new ServoConfig();
        c.setPort(getString("PORT", configNode, ""));
        c.setPortSpeed(Integer.parseInt(getString("SPEED", configNode, "115200")));
        c.setServoType(getServoType(servoName));
        c.setAbstractToRealPositionFactor(1);
        c.setAbstractToRealSpeedFactor(1);

        return c;
    }

    private static Set<ServoGroup> getServoGroups(Node doc) {
        Set<ServoGroup> groups = new HashSet<ServoGroup>();

        NodeList servoGroupList = getNodeList("/KASPAR/SERVOLIST/SERVOGROUP", doc);
        for (int i = 0; i < servoGroupList.getLength(); i++) {
            Node item = servoGroupList.item(i);
            ServoGroup g = new ServoGroup();
            g.setLocationX(Integer.parseInt(getString("COLUMN", item, "0")));
            g.setLocationY(Integer.parseInt(getString("ROW", item, "0")));
            g.setTitle(getString("NAME", item, ""));
            g.setServos(getServos(item, getNode("/KASPAR/SERVOLIST", doc)));
        }

        return groups;
    }

    private static List<Servo> getServos(Node servoGroup, Node servoList) {
        NodeList groupServos = getNodeList("MEMBER", servoGroup);
        List<Servo> servos = new ArrayList<Servo>(groupServos.getLength());

        for (int i = 0; i < groupServos.getLength(); i++) {
            Node item = groupServos.item(i);
            Servo servo = getServo(item.getTextContent(), servoList);
            if (servo != null) {
                servos.add(Integer.parseInt(getString("@pos", item, "0")), servo);
            }
        }

        return servos;
    }

    private static Servo getServo(String servoName, Node servoList) {
        Node servo = getNode("SERVO[NAME/text()='" + servoName + "']", servoList);
        if(servo == null) {
            return null;
        }

        Servo s = new Servo();        
        s.setServoType(getServoType(getString("@type", servo, "")));
        s.setDefaultPosition(ServoManager.convertStepsToDegrees(Integer.parseInt(getString("DEFAULT/POS", servo, "0"))));
        s.setDefaultSpeed(Integer.parseInt(getString("DEFAULT/SPEED", servo, "0")));
        s.setMaxPosition(ServoManager.convertStepsToDegrees(Integer.parseInt(getString("LIMITS[@type='pos']/MAX", servo, "1024"))));
        s.setMaxSpeed(Integer.parseInt(getString("LIMITS[@type='speed']/MAX", servo, "100")));
        s.setMinPosition(ServoManager.convertStepsToDegrees(Integer.parseInt(getString("LIMITS[@type='pos']/MIN", servo, "0"))));
        s.setMinSpeed(Integer.parseInt(getString("LIMITS[@type='speed']/MIN", servo, "0")));
        s.setName(getString("NAME", servo, ""));
        s.setExternalId(Integer.parseInt(getString("@id", servo, "0")));
        
        return s;
    }
    
    private static data.ServoType getServoType(String typeName) {
        if(typeName == null || "".equals(typeName)) {
            return null;
        }
        
        data.ServoType type = SessionManager.getSingle(data.ServoType.class, new SimpleEntry("name", typeName));
        if(type == null) {
            type = new data.ServoType();
            type.setName(typeName);
            type.setMinSpeed(0);
            type.setMaxSpeed(100);
            type.setMinPosition(0);
            type.setMaxPosition(360);
            SessionManager.add(type);
            SessionManager.saveAll();
        }
        
        return type;
    }
}
