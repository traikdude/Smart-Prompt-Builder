# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the working directory contents
COPY . .

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Define environment variable wrapper
ENV PYTHONUNBUFFERED=1

# Command to run the Fast API server via Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
