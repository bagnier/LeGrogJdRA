legrog:
  user.present:
    - uid: 1002
    - gid: 1002
    - home: /home/legrog
    - require:
      - group: legrog
  group.present:
    - gid: 1002

/home/legrog/application:
  cmd.run:
    - name: rm -rf /home/legrog/application; cp -r /opt/LeGrogJdRA/application /home/legrog
    - user: legrog
    - require:
      - user: legrog

node_modules:
  cmd.run:
    - name: rm -rf node_modules; npm cache clean; bower cache clean; npm install
    - user: legrog
    - cwd: /home/legrog/application
    - require:
      - pkg: npm
      - npm: bower
      - user: legrog
      - cmd: /home/legrog/application

LeGrogJdRA:
  cmd.wait:
    - name: NODE_ENV='' grunt build
    - user: legrog
    - cwd: /home/legrog/application
    - require:
      - npm: grunt
      - npm: grunt-cli
      - cmd: node_modules
      - user: legrog
    - watch_in:
      - service: supervisor

/var/log/LeGrogJdRA:
  file:
    - directory
    - user: legrog
    - group: legrog
    - mode: 1755
    - require:
      - user: legrog

/etc/supervisor/conf.d/LeGrogJdRA.conf:
  file.managed:
    - source: salt://LeGrogJdRA/LeGrogJdRA.supervisor
    - user: root
    - group: root
    - mode: 644
    - require:
      - pkg: supervisor
      - user: legrog
      - file: /var/log/LeGrogJdRA