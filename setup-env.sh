#!/bin/bash

# Get IP address
IPV4=$(curl -4 ifconfig.me)

# Create .env file
cat > .env << EOL
# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DATABASE_URL=postgresql://your_db_user:your_db_password@db:5432/your_db_name

# NextAuth Configuration
NEXTAUTH_URL=http://14.225.212.72
NEXTAUTH_SECRET=your_secret_key

# IP Address
IPV4=${IPV4}
EOL

echo "Environment file created with:"
echo "IPv4: ${IPV4}" 