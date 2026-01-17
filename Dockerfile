FROM node:20-alpine

# Install process manager
RUN npm install -g concurrently

WORKDIR /app

# ---------- Backend ----------
COPY Backend/package*.json ./Backend/
RUN cd Backend && npm install

# ---------- Frontend ----------
COPY admindashboard/package*.json ./admindashboard/
RUN cd admindashboard && npm install

# ---------- Copy full code ----------
COPY Backend ./Backend
COPY admindashboard ./admindashboard

# Expose ports
EXPOSE 5000
EXPOSE 5173

# Start both backend & frontend
CMD concurrently \
  "cd Backend && npm run dev" \
  "cd admindashboard && npm run dev"
