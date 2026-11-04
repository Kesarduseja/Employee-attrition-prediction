"""
Helper script to start the FastAPI application server.
"""
import uvicorn

if __name__ == "__main__":
    print("Starting HR Insight API server at http://127.0.0.1:8000 ...")
    print("Swagger API documentation available at http://127.0.0.1:8000/docs")
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
