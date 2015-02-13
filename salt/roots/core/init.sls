core-admin-tools:
  pkg.installed:
    - names:
      - htop
      - ntp
      - postfix
      - bsd-mailx
      - deborphan
      - syslog-ng-core
      - curl

remove-chef-and-puppet-from-ubuntu-vagrant-box:
  pkg.purged:
    - names:
      - chef
      - puppet

fail2ban:
  pkg.installed: []
  service.running:
    - enable: True
    - restart: True
    - require:
      - pkg: fail2ban
    - reload: True

logcheck:
  pkg.installed:
    - names:
      - logcheck
      - logcheck-database

/etc/logcheck/ignore.d.server/ssh:
  file.append:
    - source: salt://core/ssh-additional-logline
  require:
    - pkg: logcheck-database

syslog-ng:
  service.running:
    - watch:
        - file: /etc/logcheck/ignore.d.server/*

/etc/cron.daily/auto-upgrade:
  file.managed:
    - source: salt://core/auto-upgrade
    - user: root
    - group: root
    - mode: 755

/etc/init.d/firewall:
  file.managed:
    - source: salt://core/firewall
    - user: root
    - group: root
    - mode: 755
    - template: jinja
    - context:
      device: {{ pillar.device }}
  cmd.wait:
    - name: rm /etc/rc*/*firewall; update-rc.d firewall defaults 2 98
    - watch:
      - file: /etc/init.d/firewall
  service.running:
    - name: firewall
    - watch:
      - file: /etc/init.d/firewall

# http://askubuntu.com/questions/440649/how-to-disable-ipv6-in-ubuntu-14-04

net.ipv6.conf.all.disable_ipv6:
  sysctl.present:
    - value: 1

net.ipv6.conf.default.disable_ipv6:
  sysctl.present:
    - value: 1

net.ipv6.conf.lo.disable_ipv6:
  sysctl.present:
    - value: 1

send-root-email-to-somebody:
  alias.present:
   - name: root
   - target: {{ pillar.emailReceiver }}
   - require: 
     - pkg: postfix
