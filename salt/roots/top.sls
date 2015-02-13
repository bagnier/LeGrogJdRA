base:
  '*':
    - core
    - mongodb
    - supervisor
    - nginx
    - nodejs
    - LeGrogJdRA

  'environment:vps':
    - match: grain
    - envprod