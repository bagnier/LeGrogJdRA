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
  pkg.installed:
  - name: nodejs
  - name: nodejs-legacy

git:
  pkg.installed: []

/etc/supervisor/conf.d/nodejs.conf:
  file.managed:
    - source: salt://nodejs/supervisor.conf
    - require:
      - pkg: supervisor

npm:
  pkg.installed: []

grunt:
  npm.installed:
    - require:
      - pkg: npm

grunt-cli:
  npm.installed:
    - require:
      - pkg: npm

bower:
  npm.installed:
    - require:
      - pkg: npm

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
