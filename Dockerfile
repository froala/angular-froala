FROM node:14 as build

LABEL maintainer="rizwan@celestialsys.com"

ARG PackageName
ARG PackageVersion
ARG NexusUser
ARG NexusPassword


WORKDIR /app
COPY . .

RUN apt update -y \
    && apt install -y jq unzip wget
RUN wget --no-check-certificate --user ${NexusUser}  --password ${NexusPassword} https://nexus.tools.froala-infra.com/repository/Froala-npm/${PackageName}/-/${PackageName}-${PackageVersion}.tgz
RUN npm install -g bower
RUN npm install
RUN bower install
FROM nginx:alpine
copy --from=build /app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]