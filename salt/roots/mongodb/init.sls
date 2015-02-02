mongodb_package:
  pkgrepo.managed:
    - humanname: MongoDB PPA
    - name: deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen
    - file: /etc/apt/sources.list.d/mongodb.list
    - keyid: 7F0CEB10
    - keyserver: keyserver.ubuntu.com
  pkg.installed:
    - name: mongodb-org
    - version: 2.6.7

mongodb_db_path:
  file.directory:
    - name: /var/lib/mongodb
    - user: mongodb
    - group: mongodb
    - mode: 755
    - makedirs: True
    - recurse:
        - user
        - group

mongodb_log_path:
  file.directory:
    - name: /var/log/mongodb
    - user: mongodb
    - group: mongodb
    - mode: 755
    - makedirs: True

mongodb_service:
  service.running:
    - name: mongodb
    - enable: True
    - watch:
      - file: mongodb_configuration

mongodb_configuration:
  file.managed:
    - name: /etc/mongod.conf
    - user: root
    - group: root
    - mode: 644

mongodb_logrotate:
  file.managed:
    - name: /etc/logrotate.d/mongodb
    - user: root
    - group: root
    - mode: 440
    - source: salt://mongodb/logrotate.conf
