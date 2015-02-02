/etc/nginx/sites-enabled:
  file:
    - directory

nginx:
  pkg.installed: []
  file.absent:
    - name: /etc/nginx/sites-enabled/default
    - require:
      - pkg: nginx
  service.running:
    - enable: True
    - restart: True
    - watch:
      ## - file: /etc/nginx/nginx.conf
      - file: /etc/nginx/sites-enabled/*
    - require:
      - pkg: nginx
    - reload: True
