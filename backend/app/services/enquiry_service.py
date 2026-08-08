from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock

from app.models.enquiry import Enquiry, EnquiryCreateRequest, EnquiryStatus

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
ENQUIRIES_PATH = DATA_DIR / "enquiries.json"


class EnquiryService:
    def __init__(self, path: Path = ENQUIRIES_PATH) -> None:
        self._path = path
        self._lock = Lock()
        self._enquiries = self._load()

    def _load(self) -> list[Enquiry]:
        if not self._path.exists():
            self._path.parent.mkdir(parents=True, exist_ok=True)
            self._path.write_text("[]", encoding="utf-8")
            return []
        raw = json.loads(self._path.read_text(encoding="utf-8-sig"))
        return [Enquiry.model_validate(item) for item in raw]

    def _save(self) -> None:
        payload = [enquiry.model_dump() for enquiry in self._enquiries]
        self._path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    def _next_id(self) -> str:
        today = datetime.now(timezone.utc).strftime("%Y%m%d")
        seq = 1001 + len(self._enquiries)
        return f"ENQ-{today}-{seq}"

    def create_enquiry(self, payload: EnquiryCreateRequest) -> Enquiry:
        enquiry = Enquiry(
            **payload.model_dump(),
            id=self._next_id(),
            status="NEW",
            createdAt=datetime.now(timezone.utc).isoformat(),
        )
        with self._lock:
            self._enquiries.append(enquiry)
            self._save()
        return enquiry

    def list_enquiries(self) -> list[Enquiry]:
        return sorted(self._enquiries, key=lambda e: e.createdAt, reverse=True)

    def update_status(self, enquiry_id: str, status: EnquiryStatus) -> Enquiry | None:
        with self._lock:
            for index, existing in enumerate(self._enquiries):
                if existing.id == enquiry_id:
                    updated = existing.model_copy(update={"status": status})
                    self._enquiries[index] = updated
                    self._save()
                    return updated
        return None


_enquiry_service: EnquiryService | None = None


def get_enquiry_service() -> EnquiryService:
    global _enquiry_service
    if _enquiry_service is None:
        _enquiry_service = EnquiryService()
    return _enquiry_service
