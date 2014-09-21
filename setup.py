from setuptools import setup

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
          'dateutil',
          'gevent',
          'flask',
          'werkzeug'
          'flask-restless',
          'flask-sqlalchemy',
          'flask-socketio',
          'sqlalchemy',
          'robotActionController'
      ],
      dependancy_links=['git+ssh://git@github.com/uh-nmb/robotActionController'],
      data_files=[('/etc/init.d', ['systemConfigs/etc/init.d/kasparweb', ]),
                  ('/etc/rsyslog.d', ['systemConfigs/etc/rsyslog.d/kaspar_log.conf', ]),
                  ('/udev/rules.d', ['systemConfigs/udev/rules.d/98-keyPad.rules', 'systemConfigs/udev/rules.d/98-serial.rules', 'systemConfigs/udev/rules.d/99-input.rules'])],
      include_package_data=True,
      zip_safe=False)
