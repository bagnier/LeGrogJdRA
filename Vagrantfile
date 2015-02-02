Vagrant.configure("2") do |config|
  ## Choose your base box
  config.vm.box = "ubuntu/trusty64"

  ## For masterless, mount your salt file root
  config.vm.synced_folder "salt/roots/", "/srv/salt/"

  ## Fix the "stdin: is not a tty" warning
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

  config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.provision :salt do |salt|
    salt.minion_config = "salt/minion"
    salt.run_highstate = true
    salt.verbose = true
    salt.log_level = "warning"
    salt.colorize = true
  end
end