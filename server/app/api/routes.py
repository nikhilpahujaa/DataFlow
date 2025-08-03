from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.analyzer import Analyzer
from app.services.recommender import Recommender
from app.services.migrator import Migrator

router = APIRouter()

class AnalyzeRequest(BaseModel):
    mysql_host: str
    mysql_port: int
    mysql_database: str
    mysql_user: str
    mysql_password: str

class AnalyzeResponse(BaseModel):
    analysis: dict
    recommendation: str
    summary: str

class TransferRequest(BaseModel):
    target_db: str  # 'mongodb' or 'postgresql'
    mysql_credentials: dict
    target_credentials: dict

class TransferStatus(BaseModel):
    status: str
    details: str = None

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_db(request: AnalyzeRequest):
    try:
        # Use Analyzer to inspect MySQL schema
        analyzer = Analyzer(request.dict())
        analysis = analyzer.analyze()
        
        # Check for analysis errors
        if "error" in analysis:
            raise HTTPException(status_code=400, detail=analysis["error"])
        
        # Use Recommender to suggest target DB and explanation
        recommender = Recommender(analysis)
        rec_result = recommender.recommend()
        recommendation = rec_result["recommendation"]
        explanation = rec_result["explanation"]
        summary = f"Recommended target DB: {recommendation} based on schema analysis.\n\nReason: {explanation}"
        
        return AnalyzeResponse(
            analysis=analysis,
            recommendation=recommendation,
            summary=summary
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error during analysis: {str(e)}")

@router.post("/transfer", response_model=TransferStatus)
def transfer_data(request: TransferRequest):
    try:
        # Validate target database type
        if request.target_db.lower() not in ['postgresql', 'mongodb']:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported target database: {request.target_db}. Supported targets: postgresql, mongodb"
            )
        
        # Use Migrator to perform migration
        migrator = Migrator(
            request.mysql_credentials,
            request.target_db,
            request.target_credentials
        )
        result = migrator.migrate()
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("details", "Migration failed"))
        
        return TransferStatus(status=result.get("status", "unknown"), details=result.get("details"))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error during migration: {str(e)}")