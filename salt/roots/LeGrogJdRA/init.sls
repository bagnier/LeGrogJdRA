include:
  - nginx

legrog:
  user.present:
    - uid: 1002
    - gid: 1002
    - home: /home/legrog
    - require:
      - group: legrog
  group.present:
    - gid: 1002

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
      - user: legrog
      - file: /var/log/LeGrogJdRA

/etc/nginx/sites-available/LeGrogJdRA:
  file.managed:
    - user: root
    - group: root
    - mode: 644
    - source: salt://LeGrogJdRA/LeGrogJdRA.nginx
    - template: jinja
    - require:
      - pkg: nginx
    - watch_in:
      - service: nginx
    - context:
        server_name: {{ pillar.serverName }}

/etc/nginx/sites-enabled/LeGrogJdRA:
  file.symlink:
    - target: /etc/nginx/sites-available/LeGrogJdRA
    - require:
      - pkg: nginx
      - file: /etc/nginx/sites-available/LeGrogJdRA

extend: 
  nginx:
    service.running:
      - watch:
        - file: /etc/nginx/sites-enabled/LeGrogJdRA

LeGrogJdRA:
  git.latest:
    - name: https://github.com/bagnier/LeGrogJdRA.git
    - target: /home/legrog/LeGrogJdRA
    - user: legrog
    - require: 
      - pkg: git
  cmd.wait:
    - name: rm -rf node_modules; npm install; NODE_ENV='' grunt build
    - user: legrog
    - cwd: /home/legrog/LeGrogJdRA/application
    - require:
      - pkg: npm
      - npm: grunt
      - npm: grunt-cli
      - npm: bower
      - git: LeGrogJdRA
    - watch:
      - git: LeGrogJdRA
    - watch_in:
      - service: supervisor