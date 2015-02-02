nginx:
  pkg.installed: []
  file.absent:
    - name: /etc/nginx/sites-enabled/default
    - require:
      - pkg: nginx
  service.running:
    - enable: True
    - restart: True
    - require:
      - pkg: nginx
    - reload: True
