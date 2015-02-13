nginx:
  pkg.installed: []
  file.absent:
    - name: /etc/nginx/sites-enabled/default
    - require:
      - pkg: nginx
  service.running:
    - require:
      - pkg: nginx
      - file: /etc/nginx/ssl
      - cmd: /etc/nginx/ssl

/etc/nginx/ssl:
  file.directory:
    - user: root
    - group: root
    - mode: 755
    - require:
      - pkg: nginx
  cmd.wait:
    - name: openssl req -nodes -newkey rsa:2048 -keyout server.key -out server.csr -subj "/C=FR/ST=Paris/L=Paris/O=Le Grog/OU=Le Grog Jdra/CN=localhost"; cp server.key server.key.org; openssl rsa -in server.key.org -out server.key; openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
    - user: root
    - cwd: /etc/nginx/ssl
    - watch:
      - file: /etc/nginx/ssl

#/etc/nginx/conf.d/kibana.htpasswd:
  #cmd.run:
    #- name: htpasswd -c /etc/nginx/conf.d/kibana.htpasswd user
    #- user: root

/etc/fail2ban/jail.d/nginx-jail.conf:
  file.managed:
    - user: root
    - group: root
    - mode: 644
    - source: salt://nginx/nginx-jail.conf
    - require:
      - file: /etc/fail2ban/filter.d/nginx-auth.conf
      - file: /etc/fail2ban/filter.d/nginx-login.conf
      - file: /etc/fail2ban/filter.d/nginx-noscript.conf
      - file: /etc/fail2ban/filter.d/nginx-proxy.conf
    - watch_in:
      - service: fail2ban

/etc/fail2ban/filter.d/nginx-auth.conf:
  file.managed:
    - user: root
    - group: root
    - mode: 644
    - source: salt://nginx/nginx-auth.conf
    - require:
      - pkg: nginx

/etc/fail2ban/filter.d/nginx-login.conf:
  file.managed:
    - user: root
    - group: root
    - mode: 644
    - source: salt://nginx/nginx-login.conf
    - require:
      - pkg: nginx

/etc/fail2ban/filter.d/nginx-noscript.conf:
  file.managed:
    - user: root
    - group: root
    - mode: 644
    - source: salt://nginx/nginx-noscript.conf
    - require:
      - pkg: nginx

/etc/fail2ban/filter.d/nginx-proxy.conf:
  file.managed:
    - user: root
    - group: root
    - mode: 644
    - source: salt://nginx/nginx-proxy.conf
    - require:
      - pkg: nginx
    