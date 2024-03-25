# Screenshot Service

The Screenshot Service is a Dockerized REST API that captures screenshots of web pages. It runs a headless browser with support for JavaScript, making it capable of rendering modern web pages that rely on JS frameworks and CDN resources.

## How It Works

The service listens for GET requests with a `url` parameter specifying the web page to capture. It launches a headless browser session, navigates to the URL, waits for the page to load, and then captures a screenshot of the page in 1920x1080 resolution.

## Usage

To capture a screenshot, send a GET request to `/screenshot?url=<URL_TO_CAPTURE>`, where `<URL_TO_CAPTURE>` is the web page's URL you want to screenshot.

### Running the Service

To run the service locally, you must have Docker installed. Build and run the container using the following commands:

```bash
docker build -t screenshot-service .
docker run -p 3000:3000 screenshot-service
