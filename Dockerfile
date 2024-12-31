FROM node:23.5.0-alpine3.20
RUN addgroup xtremeDispatch && adduser -S -G xtremeDispatch xtremeDispatch
RUN mkdir /XtremeDispatch && chown xtremeDispatch:xtremeDispatch /XtremeDispatch
RUN apk add --no-cache sudo
RUN echo "xtremeDispatch ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/xtremeDispatch
USER xtremeDispatch
WORKDIR /XtremeDispatch
RUN sudo npm install -g @angular/cli@18.0.7
COPY --chown=xtremeDispatch package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY --chown=xtremeDispatch . .
CMD ["ng", "serve", "--host", "0.0.0.0"]