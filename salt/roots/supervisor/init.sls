supervisor:
  pkg.installed: []
  service.running:
    - watch:
        - file: /etc/supervisor/conf.d/*