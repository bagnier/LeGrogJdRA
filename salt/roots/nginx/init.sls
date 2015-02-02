nginx:
  pkg.installed: []
  file.absent:
    - name: /etc/nginx/sites-enabled/default
  service.running:
    - reload: True
    - watch:
      - file: /etc/nginx/sites-enabled/*
