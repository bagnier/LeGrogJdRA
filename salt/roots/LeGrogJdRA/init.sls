legrog-user:
  user.present:
    - name: legrog
    - uid: 1002
    - gid: 1002
    - home: /home/legrog
    - require:
      - group: legrog
    - require-in:
      - service: supervisor
  group.present:
    - gid: 1002
    - name: legrog

/var/log/LeGrogJdRA:
  file:
    - directory
    - user: legrog
    - group: legrog
    - mode: 1755

git:
  pkg.installed: []

/etc/supervisor/conf.d/LeGrogJdRA.conf:
  file.managed:
    - source: salt://LeGrogJdRA/LeGrogJdRA.supervisor
    - user: root
    - group: root
    - mode: 644
    - require:
      - pkg: supervisor

/etc/nginx/sites-available/LeGrogJdRA:
  file.managed:
    - user: root
    - group: root
    - mode: 644
    - source: salt://LeGrogJdRA/LeGrogJdRA.nginx
    - require:
      - pkg: nginx
    - watch_in:
      - service: nginx

/etc/nginx/sites-enabled/LeGrogJdRA:
  file.symlink:
    - target: /etc/nginx/sites-available/LeGrogJdRA
    - watch_in:
      - service: nginx
    - require:
      - pkg: nginx

LeGrogJdRA:
  git.latest:
    - name: https://github.com/bagnier/LeGrogJdRA.git
    - target: /home/legrog/LeGrogJdRA
    - user: legrog
  cmd.wait:
    - name: rm -rf node_modules; npm install; export NODE_ENV=''; grunt build
    - user: legrog
    - cwd: /home/legrog/LeGrogJdRA
    - require:
      - pkg: npm
      - npm: grunt
      - npm: grunt-cli
      - npm: bower
    - watch:
      - git: LeGrogJdRA