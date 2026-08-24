from typing import Optional, Generic, TypeVar, Any
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

T = TypeVar("T")


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class ApiResponse(CamelModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None


class GenericResponse(ApiResponse):
    pass


class APIErrorDetail(CamelModel):
    code: str
    message: str
    request_id: Optional[str] = None
    details: Optional[Any] = None


class APIErrorResponse(CamelModel):
    error: APIErrorDetail


class ErrorResponse(CamelModel):
    code: str
    message: str
    request_id: Optional[str] = None


class PaginatedResponse(CamelModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    size: int
    pages: int
