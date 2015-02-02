nodejs:
  pkg.installed:
  - name: nodejs
  - name: nodejs-legacy

npm:
  pkg.installed: []

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
