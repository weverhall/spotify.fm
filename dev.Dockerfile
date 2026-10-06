FROM node:24-slim

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN chown node:node /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]