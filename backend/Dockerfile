# Use official Python 3.12 LTS slim runtime
# NOTE: 3.12 is used (not 3.13) for maximum library compatibility with
# fastapi, google-genai, and uvicorn in production.
FROM python:3.12-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the working directory contents
COPY . .

# Prevent Python from writing .pyc bytecode files into the container layer
# and force stdout/stderr to be unbuffered for real-time Cloud Run log streaming
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Create a non-root system user for least-privilege container execution
# (Mitigates privilege escalation risk if the process is ever compromised)
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup --no-create-home appuser

USER appuser

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Command to run the FastAPI server via Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
