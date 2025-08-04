from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add the server directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'server'))

from app.services.analyzer import Analyzer
from app.services.recommender import Recommender

def analyze_database(request_data):
    try:
        # Use Analyzer to inspect MySQL schema
        analyzer = Analyzer(request_data)
        analysis = analyzer.analyze()
        
        # Check for analysis errors
        if "error" in analysis:
            return {"detail": analysis["error"]}, 400
        
        # Use Recommender to suggest target DB and explanation
        recommender = Recommender(analysis)
        rec_result = recommender.recommend()
        recommendation = rec_result["recommendation"]
        explanation = rec_result["explanation"]
        summary = f"Recommended target DB: {recommendation} based on schema analysis.\n\nReason: {explanation}"
        
        return {
            "analysis": analysis,
            "recommendation": recommendation,
            "summary": summary
        }, 200
    except Exception as e:
        return {"detail": f"Internal server error during analysis: {str(e)}"}, 500

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/analyze':
            try:
                # Read request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
                
                print(f"Received analyze request: {request_data}")
                
                # Process the request
                result, status_code = analyze_database(request_data)
                
                print(f"Analysis result: {result}, status: {status_code}")
                
                # Send response
                self.send_response(status_code)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                
                self.wfile.write(json.dumps(result).encode())
            except Exception as e:
                print(f"Error in analyze handler: {str(e)}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"detail": f"Server error: {str(e)}"}).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not Found"}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers() 