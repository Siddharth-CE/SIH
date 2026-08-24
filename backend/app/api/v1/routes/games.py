from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.game_service import GameService
from app.schemas.game import GameResponse

router = APIRouter(prefix="/games", tags=["Games"])


@router.get("", response_model=List[GameResponse], summary="List all cognitive exercise games")
def list_games(db: Session = Depends(get_db)):
    game_service = GameService(db)
    return game_service.get_games()


@router.get("/{slug}", response_model=GameResponse, summary="Get game by slug or ID")
def get_game(slug: str, db: Session = Depends(get_db)):
    game_service = GameService(db)
    return game_service.get_game_by_slug(slug)
