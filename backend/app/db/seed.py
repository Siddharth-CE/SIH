from datetime import date, datetime, timedelta, timezone
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app.models import (
    User,
    UserRole,
    Patient,
    CaregiverPatient,
    HealthcarePatient,
    Game,
    GameSession,
    Reminder,
    Medication,
    DailyActivity,
    MoodEntry,
    FamilyMemory,
    Alert,
    Appointment,
    AIInsight,
)


def seed_initial_data(db=None):
    close_when_done = False
    if db is None:
        db = SessionLocal()
        close_when_done = True

    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            return

        # 1. Create Core Users
        patient_user = User(
            id="usr-101",
            email="asha.das@nercare.in",
            phone="+919864012345",
            password_hash=get_password_hash("patient123"),
            full_name="Asha Das",
            role=UserRole.PATIENT,
            is_active=True,
        )
        caregiver_user = User(
            id="usr-201",
            email="ratul.das@nercare.in",
            phone="+919864012346",
            password_hash=get_password_hash("caregiver123"),
            full_name="Ratul Das",
            role=UserRole.CAREGIVER,
            is_active=True,
        )
        healthcare_user = User(
            id="usr-301",
            email="dr.ananya@nercare.in",
            phone="+919864012347",
            password_hash=get_password_hash("doctor123"),
            full_name="Dr. Ananya Sharma",
            role=UserRole.HEALTHCARE_WORKER,
            is_active=True,
        )
        admin_user = User(
            id="usr-999",
            email="admin@nercare.in",
            phone="+919864099999",
            password_hash=get_password_hash("admin123"),
            full_name="NER Platform Admin",
            role=UserRole.ADMIN,
            is_active=True,
        )
        db.add_all([patient_user, caregiver_user, healthcare_user, admin_user])
        db.commit()

        # 2. Create 5 Fictional Northeast Patients
        patients = [
            Patient(
                id="pat-101",
                user_id="usr-101",
                name="Asha Das",
                preferred_name="Asha Aideo",
                age=72,
                gender="female",
                region="assam",
                primary_language="as",
                secondary_language="en",
                stage="mild",
                caregiver_id="usr-201",
                healthcare_worker_id="usr-301",
                emergency_contact={"name": "Ratul Das", "relation": "Son", "phone": "+91 98640 12345"},
                daily_routine_goal=4,
                hydration_goal_glasses=6,
                hydration_current_glasses=4,
                medication_adherence_rate=94,
                overall_engagement="high",
                status_summary="Completed morning routine and Memory Garden session peacefully.",
                current_streak_days=7,
            ),
            Patient(
                id="pat-102",
                name="Rongsen Ao",
                preferred_name="Uncle Rongsen",
                age=68,
                gender="male",
                region="nagaland",
                primary_language="en",
                stage="early",
                caregiver_id="usr-201",
                healthcare_worker_id="usr-301",
                emergency_contact={"name": "Imli Ao", "relation": "Daughter", "phone": "+91 94360 54321"},
                daily_routine_goal=4,
                hydration_goal_glasses=6,
                hydration_current_glasses=3,
                medication_adherence_rate=91,
                overall_engagement="high",
                status_summary="High visual memory focus today; enjoyed woodcraft sequencing.",
                current_streak_days=5,
            ),
            Patient(
                id="pat-103",
                name="Mitali Devi",
                preferred_name="Mitali",
                age=75,
                gender="female",
                region="manipur",
                primary_language="mni",
                stage="mild",
                caregiver_id="usr-201",
                healthcare_worker_id="usr-301",
                emergency_contact={"name": "Biren Singh", "relation": "Brother", "phone": "+91 98560 67890"},
                daily_routine_goal=4,
                hydration_goal_glasses=6,
                hydration_current_glasses=2,
                medication_adherence_rate=78,
                overall_engagement="needs_attention",
                status_summary="Missed afternoon hydration; prompt sent to ASHA community worker.",
                current_streak_days=3,
            ),
            Patient(
                id="pat-104",
                name="Biren Lyngdoh",
                preferred_name="Kong Biren",
                age=70,
                gender="male",
                region="meghalaya",
                primary_language="kha",
                stage="early",
                caregiver_id="usr-201",
                healthcare_worker_id="usr-301",
                emergency_contact={"name": "Dapbiang Lyngdoh", "relation": "Niece", "phone": "+91 98630 11223"},
                daily_routine_goal=4,
                hydration_goal_glasses=6,
                hydration_current_glasses=5,
                medication_adherence_rate=88,
                overall_engagement="high",
                status_summary="Completed morning prayer and tea routine on schedule.",
                current_streak_days=9,
            ),
            Patient(
                id="pat-105",
                name="Tashi Lama",
                preferred_name="Aba Tashi",
                age=74,
                gender="male",
                region="sikkim",
                primary_language="en",
                stage="mild",
                caregiver_id="usr-201",
                healthcare_worker_id="usr-301",
                emergency_contact={"name": "Sonam Lama", "relation": "Son", "phone": "+91 97330 99887"},
                daily_routine_goal=4,
                hydration_goal_glasses=6,
                hydration_current_glasses=4,
                medication_adherence_rate=96,
                overall_engagement="high",
                status_summary="Excellent reaction time on visual focus test this morning.",
                current_streak_days=12,
            ),
        ]
        db.add_all(patients)
        db.commit()

        # 3. Create Caregiver & Healthcare Linkages
        cg_links = [
            CaregiverPatient(caregiver_id="usr-201", patient_id=p.id, relation_type="Family Caregiver")
            for p in patients
        ]
        hw_links = [
            HealthcarePatient(healthcare_worker_id="usr-301", patient_id=p.id, access_level="CLINICAL_VIEW")
            for p in patients
        ]
        db.add_all(cg_links + hw_links)
        db.commit()

        # 4. Create 6 Games
        games = [
            Game(
                id="game-memory-match",
                slug="memory",
                title="Memory Garden Match",
                category="memory",
                description="Match pairs of familiar Northeast flora, wildlife, and tea garden cards.",
                instructions="Tap cards to flip them over. Find matching pairs at a peaceful pace.",
                estimated_duration_minutes=4,
                cultural_tag="Assam Tea & Kopou Orchids",
                color="#0F4C3A",
            ),
            Game(
                id="game-object-recall",
                slug="recall",
                title="Object Memory Recall",
                category="recall",
                description="Memorize daily household and cultural objects, then identify them from a tray.",
                instructions="Look closely at the items. Once hidden, select the ones you remember.",
                estimated_duration_minutes=5,
                cultural_tag="Traditional Household Items",
                color="#1E40AF",
            ),
            Game(
                id="game-pattern-rec",
                slug="pattern",
                title="Handloom Pattern Flow",
                category="pattern",
                description="Complete soothing traditional textile and nature sequences.",
                instructions="Observe the pattern sequence and select the missing piece.",
                estimated_duration_minutes=4,
                cultural_tag="Northeast Handloom Weaves",
                color="#7C2D12",
            ),
            Game(
                id="game-attention-tap",
                slug="attention",
                title="Visual Focus & Reflex",
                category="attention",
                description="Gently focus on a target regional symbol and tap when it appears.",
                instructions="Tap the large button only when your chosen flower appears on screen.",
                estimated_duration_minutes=3,
                cultural_tag="Orchids & Pine Cones",
                color="#D97706",
            ),
            Game(
                id="game-emotion-rec",
                slug="emotion",
                title="Friendly Face Emotions",
                category="emotion",
                description="Identify warm expressions to maintain empathetic social connection.",
                instructions="Read the gentle story and select how our elder friend feels.",
                estimated_duration_minutes=4,
                cultural_tag="Community Harmony",
                color="#E06D53",
            ),
            Game(
                id="game-routine-recall",
                slug="routine",
                title="Daily Rhythm Recall",
                category="routine",
                description="Reinforce orientation and time-of-day awareness through daily activities.",
                instructions="Pick the activity that naturally matches morning, noon, or evening.",
                estimated_duration_minutes=4,
                cultural_tag="Daily Rhythm & Calm",
                color="#065F46",
            ),
        ]
        db.add_all(games)
        db.commit()

        # 5. Create Sample Game Sessions for Asha Das
        sessions = [
            GameSession(
                patient_id="pat-101",
                game_id="game-memory-match",
                game_category="memory",
                difficulty="gentle",
                difficulty_score=3,
                score=100,
                max_possible_score=100,
                accuracy=92,
                attempts=6,
                successful_attempts=5,
                average_response_time_ms=2300,
                time_spent_seconds=45,
                completed_at=datetime.now(timezone.utc) - timedelta(hours=3),
                feedback_given="Splendid! You matched everything smoothly.",
                adaptive_delta="increased",
            ),
            GameSession(
                patient_id="pat-101",
                game_id="game-object-recall",
                game_category="recall",
                difficulty="gentle",
                difficulty_score=2,
                score=80,
                max_possible_score=100,
                accuracy=85,
                attempts=4,
                successful_attempts=3,
                average_response_time_ms=2800,
                time_spent_seconds=50,
                completed_at=datetime.now(timezone.utc) - timedelta(days=1),
                feedback_given="Great recall! Keep up the gentle rhythm.",
                adaptive_delta="maintained",
            ),
        ]
        db.add_all(sessions)

        # 6. Create Reminders for Asha Das
        reminders = [
            Reminder(
                patient_id="pat-101",
                title="Morning Blood Pressure Medicine",
                type="medication",
                time="09:00 AM",
                time_of_day="morning",
                dosage_or_instruction="1 tablet with warm water (Telmisartan 40mg)",
                status="completed",
                scheduled_for_date=date.today(),
                completed_at=datetime.now(timezone.utc) - timedelta(hours=4),
            ),
            Reminder(
                patient_id="pat-101",
                title="Afternoon Herbal Tea & Hydration",
                type="hydration",
                time="03:30 PM",
                time_of_day="afternoon",
                dosage_or_instruction="1 glass warm tulsi water",
                status="pending",
                scheduled_for_date=date.today(),
            ),
            Reminder(
                patient_id="pat-101",
                title="Evening Memory Board Review",
                type="activity",
                time="06:00 PM",
                time_of_day="evening",
                dosage_or_instruction="Enjoy family photos with Ratul",
                status="pending",
                scheduled_for_date=date.today(),
            ),
        ]
        db.add_all(reminders)

        # 7. Create Daily Activities
        activities = [
            DailyActivity(
                patient_id="pat-101",
                time="07:00 AM",
                time_of_day="morning",
                type="morning_wake",
                default_title="Morning Freshness & Tulsi Tea",
                completed=True,
                completed_at=datetime.now(timezone.utc) - timedelta(hours=6),
                scheduled_for_date=date.today(),
                duration_minutes=20,
            ),
            DailyActivity(
                patient_id="pat-101",
                time="09:00 AM",
                time_of_day="morning",
                type="medication",
                default_title="Morning Medicine with Warm Water",
                completed=True,
                completed_at=datetime.now(timezone.utc) - timedelta(hours=4),
                scheduled_for_date=date.today(),
                duration_minutes=10,
            ),
            DailyActivity(
                patient_id="pat-101",
                time="11:00 AM",
                time_of_day="morning",
                type="game",
                default_title="Memory Garden Brain Exercise",
                completed=True,
                completed_at=datetime.now(timezone.utc) - timedelta(hours=2),
                scheduled_for_date=date.today(),
                duration_minutes=15,
            ),
            DailyActivity(
                patient_id="pat-101",
                time="01:00 PM",
                time_of_day="afternoon",
                type="meal",
                default_title="Nutritious Midday Lunch",
                completed=False,
                scheduled_for_date=date.today(),
                duration_minutes=30,
            ),
        ]
        db.add_all(activities)

        # 8. Create Family Memories
        memories = [
            FamilyMemory(
                patient_id="pat-101",
                title="Jorhat Tea Estate Veranda",
                relationship_or_place="Jorhat, Upper Assam",
                category="places",
                description="Watching the morning mist lift over the emerald green tea bushes with a hot brass cup of tea.",
                date_or_era="1984 — Jorhat Family Home",
                tags=["Tea Garden", "Jorhat"],
                favorite=True,
            ),
            FamilyMemory(
                patient_id="pat-101",
                title="Grandson Rohan Visiting for Bihu",
                relationship_or_place="Grandson Rohan",
                category="people",
                description="Rohan dancing playfully in traditional gamosa while enjoying pitha.",
                date_or_era="Rongali Bihu 2024",
                tags=["Grandson", "Bihu"],
                favorite=True,
            ),
        ]
        db.add_all(memories)

        # 9. Create Alerts
        alerts = [
            Alert(
                patient_id="pat-103",
                patient_name="Mitali Devi",
                type="low_hydration",
                severity="warning",
                title="Hydration Intake Below Goal",
                message="Mitali Devi has logged 2 of 6 recommended glasses by 2:00 PM.",
                action_required="Offer a warm cup of lemon water or soup during visit.",
                read=False,
                resolved=False,
            ),
            Alert(
                patient_id="pat-101",
                patient_name="Asha Das",
                type="appointment_approaching",
                severity="info",
                title="Upcoming Geriatric Check-In",
                message="Routine check-up scheduled with Dr. Ananya Sharma on Friday at 10:30 AM.",
                action_required="Review medication log and bring latest blood pressure record.",
                read=True,
                resolved=True,
            ),
        ]
        db.add_all(alerts)

        # 10. Create AI Insights
        insights = [
            AIInsight(
                patient_id="pat-101",
                title="Optimal Morning Cognitive Engagement",
                summary="Asha Das demonstrates 94% accuracy with prompt reaction times during 10:00 AM - 11:30 AM sessions.",
                recommendation="Keep visual memory and handloom exercises scheduled during morning hours for best comfort.",
                confidence_score=0.95,
                is_clinical_flag="routine_positive",
            )
        ]
        db.add_all(insights)

        db.commit()
    finally:
        if close_when_done:
            db.close()
