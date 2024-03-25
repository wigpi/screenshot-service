# Screenshot Service

The Screenshot Service is a Dockerized REST API that captures screenshots of web pages. It runs a headless browser with support for JavaScript, making it capable of rendering modern web pages that rely on JS frameworks and CDN resources.

## How It Works

The service listens for GET requests with a `url` parameter specifying the web page to capture, and optional `width` and `height` parameters to specify the dimensions of the screenshot. It launches a headless browser session, navigates to the URL, waits for the page to load, and then captures a screenshot of the page with the specified dimensions.

## Usage

To capture a screenshot, send a GET request to `/screenshot?url=<URL_TO_CAPTURE>&width=<WIDTH>&height=<HEIGHT>`, where `<URL_TO_CAPTURE>` is the web page's URL you want to screenshot, and `<WIDTH>` and `<HEIGHT>` are optional parameters to specify the dimensions of the screenshot. If `width` and `height` are not specified, the default resolution of 1920x1080 will be used.

Example: `http://localhost:3000/screenshot?url=https://example.com&width=1024&height=768`

### Running the Service

To run the service locally, you must have Docker installed. Build and run the container using the following commands:

```bash
docker build -t screenshot-service .
docker run -p 3000:3000 screenshot-service
