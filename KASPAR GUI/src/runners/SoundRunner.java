package runners;

import data.Robot;
import data.Sound;
import java.io.File;
import java.io.IOException;
import java.util.logging.Level;
import javax.media.ControllerEvent;
import javax.media.ControllerListener;
import javax.media.EndOfMediaEvent;
import javax.media.Manager;
import javax.media.MediaLocator;
import javax.media.NoPlayerException;
import javax.media.Player;
import gui.GuiLogger;

public class SoundRunner extends Thread {

    private static boolean isActive = false;
    private MediaLocator soundFile;
    private Robot robot;
    
    public SoundRunner(Robot robot) {
        this.robot = robot;
    }
    
    public void execute(Sound sound) {
        File f = new File(sound.getSoundFile());
        this.soundFile = new MediaLocator("file:///" + f.getAbsolutePath());
        throw new UnsupportedOperationException("Not yet implemented");
    }

//    public void setSoundFile(File soundFile) {
//        try {
//            AudioFileFormat af = AudioSystem.getAudioFileFormat(soundFile);
//            af.getType();
//        } catch (UnsupportedAudioFileException ex) {
//            Logger.getLogger(SequenceRunner.class.getName()).log(Level.SEVERE, "Unknown audio file format in file " + soundFile + "'", ex);
//        } catch (IOException ex) {
//            Logger.getLogger(SequenceRunner.class.getName()).log(Level.SEVERE, "Can't open sound file '" + soundFile + "'", ex);
//        }
//
//        if (soundFile.exists()) {
//            this.soundFile = soundFile;
//        } else {
//            KasparLogger.getLogger().log(Level.SEVERE, "Soundfile \"{0}\" doesn''t exists for sequence \"{1}\"!", new Object[]{soundFile.getName(), name});
//        }
//        setIsSaved(false);
//    }
    
    @Override
    public void run() {

        // We don't want to interrupt or collide with another sound thread
        if (isActive) {
            return;
        }
        isActive = true;

        if (soundFile != null) {
            try {
                final Player player = Manager.createPlayer(soundFile);

                player.addControllerListener(new ControllerListener() {
                    @Override
                    public void controllerUpdate(ControllerEvent e) {
                        if (e instanceof EndOfMediaEvent) {
                            player.stop();
                            player.close();
                            isActive = false;

                        }
                    }
                });
                player.realize();
                player.start();

            } catch (IOException ex) {
                GuiLogger.getLogger().log(Level.SEVERE, "Can't find sound file " + soundFile.toString(), ex);
            } catch (NoPlayerException ex) {
                GuiLogger.getLogger().log(Level.SEVERE, "Can't find a player to play sound file " + soundFile.toString(), ex);
            }
        }
    }
}
