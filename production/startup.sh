#!/bin/bash

apt-get update -y
apt-get upgrade -y

#Install Docker
apt-get install -y docker.io
systemctl enable docker
systemctl start docker

#Install Docker compose
curl -L "https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

#Make project directory
mkdir -p /home/ubuntu/senns-fortress
chown ubuntu:ubuntu /home/ubuntu/senns-fortress

# Create 1GB swap file
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
