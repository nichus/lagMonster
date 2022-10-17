FROM node:18.11.0-bullseye-slim
ENV NODE_ENV production
WORKDIR /usr/src/lagMonster
COPY --chown=node:node package*.json /usr/src/lagMonster/

#RUN npm ci --omit=dev --only=production
RUN npm ci --omit=dev

COPY --chown=node:node . /usr/src/lagMonster

USER node
CMD [ "npm", "run", "pm2" ]

