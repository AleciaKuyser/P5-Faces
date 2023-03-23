from http.server import SimpleHTTPRequestHandler, HTTPServer 
import webbrowser

port = 5385
address = ('', port)
httpd = HTTPServer(address, SimpleHTTPRequestHandler)

url = 'localhost:' + str(port)
webbrowser.open(url, new=1)

httpd.serve_forever()