# Finance Tracker

A web application to help you keep track of your expenses. Organize your expenses with customizable categories, maintain transparency with detailed logs, and secure your data with user accounts.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

**Docker**: Easiest way to try out the application is to use Docker. Get docker from the official site: [Docker Installation Guide](https://docs.docker.com/get-docker/)

### Installation

1. Clone the repository 
```bash
git clone https://github.com/niko2s/finance-tracker.git
```
2. Navigate to the project folder
```bash
cd finance-tracker
```
3. Run the application using Docker and Docker Compose
```bash
docker-compose up
``````


### Try it out

Once the application is running, you can access it in your web browser by visiting: [localhost:5174](http://localhost:5174)

### Cleanup

After you're done using the application, you can stop and clean up everything by running the following command: 
```bash
docker-compose down --rmi all -v
``` 
or remove everything except the Postgres image with:
```bash
docker-compose down --rmi local -v
```
