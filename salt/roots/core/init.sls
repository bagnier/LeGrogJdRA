# fresh-look:
  # pkg.uptodate:
    # - refresh : true
  # cmd.run:
    # - name: apt-get -y --purge autoremove
  ## salt.modules.aptpkg. autoremove (list_only=False)

core-admin-tools:
  pkg.installed:
    - names:
      - htop
      - fail2ban
      - ntp
      - postfix
      - bsd-mailx
      - deborphan
      - curl

remove-chef-and-puppet-from-ubuntu-vagrant-box:
  pkg.removed:
    - names:
      - chef
      - puppet

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

rsyslog:
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
  cmd.wait:
    - name: update-rc.d firewall start 01 2 3 4 5 . stop 98 0 1 6 .
    - watch:
      - file: /etc/init.d/firewall

firewall:
  cmd.wait:
    - name: /etc/init.d/firewall start
    - watch:
      - file: /etc/init.d/firewall

send-root-email-to-somebody:
  alias.present:
   - name: root
   - target: "stephane.bagnier@gmail.com"
   - require: 
     - pkg: postfix
