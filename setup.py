from setuptools import setup
from setuptools.command.develop import develop
from setuptools.command.install import install
from subprocess import call
import platform

if platform.system() == 'Linux':
    dataFiles = [('/etc/init.d', ['systemConfigs/etc/init.d/kasparweb', ]),
                  ('/etc/rsyslog.d', ['systemConfigs/etc/rsyslog.d/kaspar_log.conf', ]),
                  ('/udev/rules.d', ['systemConfigs/udev/rules.d/98-keyPad.rules', 'systemConfigs/udev/rules.d/98-serial.rules', 'systemConfigs/udev/rules.d/99-input.rules'])]
else:
    dataFiles = []


def serviceUpdater(command_subclass):
    orig_run = command_subclass.run

    def modified_run(self):
        orig_run(self)
        if platform.system() == 'Linux':
            call(['update-rd.d', 'kasparweb', 'defaults'])

    command_subclass.run = modified_run
    return command_subclass


@serviceUpdater
class CustomDevelopCommand(develop):
    pass


@serviceUpdater
class CustomInstallCommand(install):
    pass


def readme():
    with open('README.md') as f:
        return f.read()

setup(name='kaspar_gui',
      version='0.1',
      description='Internet based Front-End for the KASPAR Robot',
      long_description=readme(),
      classifiers=[
        'Development Status :: 1 - Beta',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 2.7',
      ],
      url='http://github.com/uh-nmb/KASPAR',
      author='Nathan Burke',
      author_email='n.burke@natbur.com',
      license='MIT',
      packages=['kasparGUI'],
      install_requires=[
          'python-dateutil',
          'gevent',
          'flask',
          'werkzeug',
          'flask-restless',
          'flask-sqlalchemy',
          'flask-socketio',
          'sqlalchemy',
          'robotActionController'
      ],
      dependency_links=['git+ssh://git@github.com/uh-nmb/robotActionController'],
      data_files=dataFiles,
      include_package_data=True,
      zip_safe=False)