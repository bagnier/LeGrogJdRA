nginx:
  pkg.installed: []
  file.absent:
    - name: /etc/nginx/sites-enabled/default
  service.running:
    - reload: True
    - watch:
      - file: /etc/nginx/sites-enabled/*


/etc/nginx/sites-available/LeGrogJdRA:
  file.managed:
    - user: root
    - group: root
    - mode: 440
    - source: salt://nginx/LeGrogJdRA

/etc/nginx/sites-enabled/LeGrogJdRA:
  file.symlink:
    - target: /etc/nginx/sites-available/LeGrogJdRA