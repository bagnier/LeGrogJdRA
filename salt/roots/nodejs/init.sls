legrog-user:
  user.present:
    - name: legrog
    - uid: 1002
    - gid: 1002
    - home: /home/legrog
    - require:
      - group: legrog
  group.present:
    - gid: 1002
    - name: legrog

/var/log/LeGrogJdRA:
  file:
    - directory
    - user: legrog
    - group: legrog
    - mode: 1755

nodejs:
  pkg.installed: []

git:
  pkg.installed: []
  git.latest:
    - name: https://github.com/bagnier/LeGrogJdRA.git
    - target: /home/legrog/LeGrogJdRA
    - user: legrog

/etc/supervisor/conf.d/nodejs.conf:
  file.managed:
    - source: salt://nodejs/supervisor.conf
    - require:
      - pkg: supervisor
