import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException

from app import config
from app.models.admin import AdminLoginRequest, AdminLoginResponse, AdminStats
from app.models.booking import Booking
from app.models.package import Package, PackageCreate, PackageUpdate
from app.services.admin_auth import create_admin_token, require_admin
from app.services.booking_service import get_booking_service
from app.services.email_service import send_booking_confirmation_email
from app.services.package_service import get_package_service

router = APIRouter()


@router.post("/login", response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest) -> AdminLoginResponse:
    valid_username = secrets.compare_digest(payload.username, config.ADMIN_USERNAME)
    valid_password = secrets.compare_digest(payload.password, config.ADMIN_PASSWORD)
    if not (valid_username and valid_password):
        raise HTTPException(status_code=401, detail="Invalid admin username or password.")

    token, expires_at = create_admin_token()
    return AdminLoginResponse(token=token, expiresAt=expires_at.isoformat())


@router.get("/bookings", response_model=list[Booking], dependencies=[Depends(require_admin)])
def list_bookings() -> list[Booking]:
    return get_booking_service().list_bookings()


@router.get(
    "/bookings/{booking_id}", response_model=Booking, dependencies=[Depends(require_admin)]
)
def get_booking(booking_id: str) -> Booking:
    booking = get_booking_service().get_booking(booking_id)
    if booking is None:
        raise HTTPException(status_code=404, detail=f"Booking '{booking_id}' not found.")
    return booking


@router.post(
    "/bookings/{booking_id}/confirm",
    response_model=Booking,
    dependencies=[Depends(require_admin)],
)
def confirm_booking(booking_id: str, background_tasks: BackgroundTasks) -> Booking:
    booking, newly_confirmed = get_booking_service().confirm_booking(booking_id)
    if newly_confirmed:
        background_tasks.add_task(send_booking_confirmation_email, booking)
    return booking


@router.get("/stats", response_model=AdminStats, dependencies=[Depends(require_admin)])
def get_stats() -> AdminStats:
    bookings = get_booking_service().list_bookings()
    today = datetime.now(timezone.utc).date().isoformat()

    total_bookings = len(bookings)
    confirmed_bookings = sum(1 for b in bookings if b.status == "CONFIRMED")
    pending_bookings = sum(1 for b in bookings if b.status == "PROCESSING")
    bookings_today = sum(1 for b in bookings if b.createdAt[:10] == today)
    total_revenue = sum(b.totalAmount for b in bookings)

    return AdminStats(
        totalBookings=total_bookings,
        confirmedBookings=confirmed_bookings,
        pendingBookings=pending_bookings,
        bookingsToday=bookings_today,
        totalRevenue=total_revenue,
    )


@router.get("/packages", response_model=list[Package], dependencies=[Depends(require_admin)])
def admin_list_packages() -> list[Package]:
    return get_package_service().list_packages(active_only=False)


@router.post("/packages", response_model=Package, dependencies=[Depends(require_admin)])
def admin_create_package(payload: PackageCreate) -> Package:
    return get_package_service().create_package(payload)


@router.put(
    "/packages/{package_id}",
    response_model=Package,
    dependencies=[Depends(require_admin)],
)
def admin_update_package(package_id: str, payload: PackageUpdate) -> Package:
    return get_package_service().update_package(package_id, payload)


@router.delete(
    "/packages/{package_id}",
    status_code=204,
    dependencies=[Depends(require_admin)],
)
def admin_delete_package(package_id: str) -> None:
    get_package_service().delete_package(package_id)
