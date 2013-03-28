package gui;

import data.Action;
import data.GUIButton;
import data.Interaction;
import data.InteractionLog;
import data.Robot;
import data.Sequence;
import data.User;
import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.LinkedList;
import java.util.List;
import javax.swing.AbstractAction;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.KeyStroke;
import javax.swing.ListSelectionModel;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.DefaultTableModel;
import managers.SessionManager;
import runners.ActionRunner;

class ControlPanel extends JPanel implements ActionListener {

    private Interaction interaction;
    private List<GUIButton> seqList;
    private JPanel pnlButtons;
    private JLabel lblMappingName;
    KeyMappingTableModel kmTM;
    Robot robot;

    public ControlPanel(Robot robot) {

        this.loadButtons();
        this.kmTM = new KeyMappingTableModel(this.seqList);
        this.robot = robot;

        this.setLayout(new BorderLayout());

        // Create panel with all the available sequences
        this.pnlButtons = new JPanel();
        populatePanel();

        // Put everything into a scrollpane and add to panel
        JScrollPane scrButtons = new JScrollPane(this.pnlButtons);
        this.add(scrButtons, BorderLayout.CENTER);

        JPanel pnlKeyMappings = new JPanel();
        pnlKeyMappings.setLayout(new BoxLayout(pnlKeyMappings, BoxLayout.Y_AXIS));
        this.lblMappingName = new JLabel("Default");
        JButton btnSaveMapping = new JButton("Save");
        btnSaveMapping.setActionCommand("btnSave");
        btnSaveMapping.addActionListener(this);
        pnlKeyMappings.add(this.lblMappingName);
        pnlKeyMappings.add(btnSaveMapping);

        JTable tblMappings = new JTable(kmTM);
        this.kmTM.addTableModelListener(new TableModelListener() {
            @Override
            public void tableChanged(TableModelEvent e) {

                populatePanel();
            }
        });
        tblMappings.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        JScrollPane scroller = new JScrollPane(tblMappings);
        pnlKeyMappings.add(scroller);

        this.add(pnlKeyMappings, BorderLayout.EAST);
    }

    public void updatePanel() {
        this.kmTM.updateList(this.seqList);
    }

    public final void populatePanel() {
        this.loadButtons();
        this.pnlButtons.removeAll();
        this.pnlButtons.setLayout(new GridLayout((int) Math.ceil(this.seqList.size() / 2.0), 2, 5, 5));

        this.getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW).clear();
        this.getActionMap().clear();

        // Create buttons for all sequences and add them to the panel
        for (GUIButton button : this.seqList) {
            String actionName = button.getTitle();
            KeyAction ka = new KeyAction(actionName, this.robot, button);

            for (String hotKey : button.getHotKeys()) {
                KeyStroke key = KeyStroke.getKeyStroke(hotKey);
                this.getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW).put(key, actionName);
            }
            
            this.getActionMap().put(actionName, ka);

            JButton btn = new JButton(ka);
            btn.setText(button.getTitle());
            btn.setEnabled(ActionRunner.isValid(button.getSequence()));

            // And add to the panel
            pnlButtons.add(btn);
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        String command = e.getActionCommand();
        if (command.equals("btnSave")) {
            //TODO: Save
            //keyToSeq.save();
        }
    }

    private void loadButtons() {
        seqList = new LinkedList<GUIButton>();
        for (User u : SessionManager.getCurrentInteraction().getUsers()) {
            seqList.addAll(u.getButtons());
        }
    }

    private class KeyMappingTableModel extends DefaultTableModel {

        private final static long serialVersionUID = 2903982347l;
        List<GUIButton> seqMapping;
        String[] columnNames = {"Action", "Key"};

        public KeyMappingTableModel(List<GUIButton> map) {
            super();
            seqMapping = map;
        }

        public void updateList(List<GUIButton> map) {
            seqMapping = map;
            fireTableDataChanged();
        }

        @Override
        public int getRowCount() {
            if (seqMapping != null) {
                return seqMapping.size();
            } else {
                return 0;
            }
        }

        @Override
        public int getColumnCount() {
            return 2;
        }

        @Override
        public String getColumnName(int columnIndex) {
            return columnNames[columnIndex];
        }

        @Override
        public Class<?> getColumnClass(int columnIndex) {
            if (columnIndex == 0) {
                return String.class;
            } else if (columnIndex == 1) {
                return Action.class;
            } else {
                throw new ArrayIndexOutOfBoundsException();
            }
        }

        @Override
        public boolean isCellEditable(int rowIndex, int columnIndex) {
            return columnIndex == 1;
        }

        @Override
        public Object getValueAt(int rowIndex, int columnIndex) {
            if (columnIndex == 0) {
                return seqMapping.get(rowIndex).getTitle();
            } else if (columnIndex == 1) {
                return seqMapping.get(rowIndex).getSequence();
            } else {
                throw new ArrayIndexOutOfBoundsException();
            }
        }

        @Override
        public void setValueAt(Object aValue, int rowIndex, int columnIndex) {
            if (columnIndex == 0) {
            } else if (columnIndex == 1) {
                seqMapping.get(rowIndex).setSequence((Sequence) aValue);
                fireTableCellUpdated(rowIndex, columnIndex);
            } else {
                throw new ArrayIndexOutOfBoundsException();
            }
        }
    }

    private class KeyAction extends AbstractAction {

        private GUIButton button;
        private ActionRunner ar;

        public KeyAction(String name, Robot robot, GUIButton button) {
            super(name);
            
            this.ar = new ActionRunner(robot);
            this.button = button;

            // Now open the file we want to write log to if not already opened
            if (interaction == null) {
                interaction = SessionManager.getCurrentInteraction();
            }
        }

        @Override
        public void actionPerformed(ActionEvent e) {
            InteractionLog l = new InteractionLog();
            l.setInteraction(interaction);
            l.setButton(button);
            ar.execute(button.getSequence());
        }
    }
}
