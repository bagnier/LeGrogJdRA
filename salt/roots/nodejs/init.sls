nodejs:
  pkg.installed:
  - name: nodejs
  - name: nodejs-legacy

npm:
  pkg.installed: []
  - require:
      - pkg: nodejs

grunt:
  npm.installed:
    - require:
      - pkg: npm

grunt-cli:
  npm.installed:
    - require:
      - pkg: npm

bower:
  npm.installed:
    - require:
      - pkg: npm
