include:
  - nginx

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