import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = "."

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run_server():
    """
    Starts a local HTTP server to bypass CORS issues and opens the dashboard.
    """
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            url = f"http://localhost:{PORT}/index.html"
            print(f"\n" + "="*50)
            print("MailSentry Intelligence Dashboard is LIVE! 🚀")
            print(f"URL: {url}")
            print("="*50)
            print("Press Ctrl+C to stop the server.")
            
            # Automatically open the browser
            webbrowser.open(url)
            
            httpd.serve_forever()
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == "__main__":
    run_server()
