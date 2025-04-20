#!/bin/bash
set -e

echo "Installing depedencies"

sudo apt update && sudo apt upgrade -y
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    certbot python3-certbot-nginx

## NODE ##
# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04
echo "Installing Node"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo "Node installation complete"

## DOCKER ##
# https://docs.docker.com/engine/install/ubuntu/
echo "Installing Docker"

for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# systemd will boot docker in startup
# https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units
sudo systemctl enable --now docker
# this is for testing
sudo docker run hello-world
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker compose version)"
echo "Docker installation complete"