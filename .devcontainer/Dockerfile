FROM node:22.14.0

# Install postgres client to allow interacting with db via
# command line from our default working environment container 
# (node container) without having to open a shell inside the db container.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    # postgresql-client-16 (our current version) is not available 
    # by default in debian version used by node image, so we have 
    # to do the next two commands before we can install.
    # Also it is not possible to install specific minor versions,
    # only latest minor version is available.
    # https://superuser.com/questions/1836604/why-postgresql-latest-stable-release-is-not-in-debian-stable-repository-yet
    # https://stackoverflow.com/questions/48868156/how-to-install-the-specific-version-of-postgres
    && apt-get -y install --no-install-recommends postgresql-common \
    # This script is an interactive script that requires pressing enter
    # before it can proceed, so we need to pipe in that character
    && echo "\r" | /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh \
    # Finally we can install it
    && apt-get -y install --no-install-recommends postgresql-client-16

# Install nvm for switching node versions easily
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"
