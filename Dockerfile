FROM node:26.5.0-bookworm-slim
ENV NODE_ENV production
WORKDIR /usr/src/lagMonster
COPY --chown=node:node package*.json /usr/src/lagMonster/

#RUN npm ci --omit=dev --only=production
RUN npm ci --omit=dev

COPY --chown=node:node . /usr/src/lagMonster

USER node
CMD [ "npm", "run", "pm2" ]

