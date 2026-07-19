import datetime
import os
from dotenv import load_dotenv
from .database import get_db
from . import auth

load_dotenv()

def seed_db():
    db_gen = get_db()
    db = next(db_gen)
    try:
        # 1. Clear existing data
        db.clear_all_data()

        # 2. Seed Users
        admin_email = os.getenv("SEED_ADMIN_EMAIL")
        admin_password = os.getenv("SEED_ADMIN_PASSWORD")
        solver_password = os.getenv("SEED_SOLVER_PASSWORD")
        citizen_password = os.getenv("SEED_CITIZEN_PASSWORD")
        
        arjun_email = os.getenv("SEED_ARJUN_EMAIL")
        rohit_email = os.getenv("SEED_ROHIT_EMAIL")
        sneha_email = os.getenv("SEED_SNEHA_EMAIL")
        suresh_email = os.getenv("SEED_SURESH_EMAIL")
        citizen_email = os.getenv("SEED_CITIZEN_EMAIL")

        if not all([admin_email, admin_password, solver_password, citizen_password,
                    arjun_email, rohit_email, sneha_email, suresh_email, citizen_email]):
            raise ValueError("All SEED_ credentials must be configured in environment variables (.env).")

        admin_pass = auth.get_password_hash(admin_password)
        solver_pass = auth.get_password_hash(solver_password)
        citizen_pass = auth.get_password_hash(citizen_password)

        admin_id = db.seed_user(
            email=admin_email,
            hashed_password=admin_pass,
            full_name="Admin",
            role="admin",
            credits=0,
            xp=0,
            level=1,
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
        )

        arjun_id = db.seed_user(
            email=arjun_email,
            hashed_password=solver_pass,
            full_name="Arjun Kumar",
            role="solver",
            credits=0,
            xp=0,
            level=1,
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
        )

        rohit_id = db.seed_user(
            email=rohit_email,
            hashed_password=solver_pass,
            full_name="Rohit Sharma",
            role="solver",
            credits=520,
            xp=450,
            level=5,
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
        )

        sneha_id = db.seed_user(
            email=sneha_email,
            hashed_password=solver_pass,
            full_name="Sneha Reddy",
            role="solver",
            credits=410,
            xp=320,
            level=4,
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
        )

        suresh_id = db.seed_user(
            email=suresh_email,
            hashed_password=solver_pass,
            full_name="Suresh P.",
            role="solver",
            credits=95,
            xp=45,
            level=1,
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh",
        )

        citizen_id = db.seed_user(
            email=citizen_email,
            hashed_password=citizen_pass,
            full_name="Amit Patel",
            role="citizen",
            credits=0,
            xp=0,
            level=1,
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
        )

        # 3. Seed Issues
        db.seed_issue(
            id=1250,
            citizen_id=citizen_id,
            title="Large pothole on 5th Main Road",
            description="A dangerous large pothole is filled with rainwater on 5th Main Road, slowing traffic and causing severe safety hazards for motorbikes.",
            category="Road Damage",
            priority="High",
            status="In Progress",
            latitude=12.9348,
            longitude=77.6208,
            image_url="http://localhost:8000/uploads/issue1.png",
            created_at=datetime.datetime.utcnow()
        )

        db.seed_issue(
            id=1249,
            citizen_id=citizen_id,
            title="Garbage overflow near BDA Park",
            description="Trash and debris are piling up next to BDA Park fence. Bad odor and health concern for visiting children.",
            category="Garbage",
            priority="Medium",
            status="Pending",
            latitude=12.9372,
            longitude=77.6231,
            image_url="http://localhost:8000/uploads/issue2.png",
            created_at=datetime.datetime.utcnow()
        )

        db.seed_issue(
            id=1248,
            citizen_id=citizen_id,
            title="Street light not working",
            description="The entire crossroad near sector 3 HSR is pitch dark as the main street lamp is broken.",
            category="Street Light",
            priority="Medium",
            status="In Progress",
            latitude=12.9116,
            longitude=77.6388,
            image_url="http://localhost:8000/uploads/issue3.png",
            created_at=datetime.datetime.utcnow()
        )

        db.seed_issue(
            id=1247,
            citizen_id=citizen_id,
            title="Water leakage near 7th Cross",
            description="Water is constantly leaking from the public utility pipeline near 7th cross, flooding the gutter.",
            category="Water Supply",
            priority="Low",
            status="Pending",
            latitude=12.9304,
            longitude=77.6255,
            image_url="http://localhost:8000/uploads/issue4.png",
            created_at=datetime.datetime.utcnow()
        )

        db.seed_issue(
            id=1246,
            citizen_id=citizen_id,
            title="Wall graffiti on public property",
            description="Unapproved graffiti tagging painted on the municipal concrete walls near 4th block.",
            category="Others",
            priority="Low",
            status="Pending",
            latitude=12.9331,
            longitude=77.6189,
            image_url="http://localhost:8000/uploads/issue5.png",
            created_at=datetime.datetime.utcnow()
        )

        db.seed_issue(
            id=1245,
            citizen_id=citizen_id,
            title="Garbage cleared near 7th Block",
            description="Cleared overflow garbage near 7th block.",
            category="Garbage",
            priority="Medium",
            status="Completed",
            latitude=12.9312,
            longitude=77.6241,
            image_url="http://localhost:8000/uploads/garbage_before.png",
            created_at=datetime.datetime.utcnow()
        )

        db.seed_issue(
            id=1241,
            citizen_id=citizen_id,
            title="Pothole fixed on 4th Main Road",
            description="Fixed pothole on 4th main road.",
            category="Road Damage",
            priority="High",
            status="Completed",
            latitude=12.9328,
            longitude=77.6198,
            image_url="http://localhost:8000/uploads/pothole_before.png",
            created_at=datetime.datetime.utcnow()
        )

        # 4. Seed Tasks
        db.seed_task(
            id=1,
            issue_id=1250,
            solver_id=arjun_id,
            status="In Progress",
            before_image="http://localhost:8000/uploads/issue1.png",
            after_image=None,
            accepted_at=datetime.datetime.utcnow(),
            completed_at=None
        )

        db.seed_task(
            id=2,
            issue_id=1248,
            solver_id=arjun_id,
            status="In Progress",
            before_image="http://localhost:8000/uploads/issue3.png",
            after_image=None,
            accepted_at=datetime.datetime.utcnow(),
            completed_at=None
        )

        db.seed_task(
            id=1245,
            issue_id=1245,
            solver_id=arjun_id,
            status="Completed",
            before_image="http://localhost:8000/uploads/garbage_before.png",
            after_image="http://localhost:8000/uploads/garbage_after.png",
            accepted_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=60),
            completed_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
        )

        db.seed_task(
            id=1241,
            issue_id=1241,
            solver_id=suresh_id,
            status="Completed",
            before_image="http://localhost:8000/uploads/pothole_before.png",
            after_image="http://localhost:8000/uploads/pothole_after.png",
            accepted_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45),
            completed_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=30)
        )

        # 5. Seed Alerts
        db.seed_alert(
            text="High priority issue reported in HSR Layout, Sector 2",
            type="alert",
            time_ago="10 mins ago",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=10)
        )
        db.seed_alert(
            text="New issue reported in Koramangala 7th Block",
            type="warning",
            time_ago="25 mins ago",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=25)
        )
        db.seed_alert(
            text="Solver submitted verification for issue #UP-1245",
            type="success",
            time_ago="45 mins ago",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
        )
        db.seed_alert(
            text="Issue #UP-1220 marked as resolved",
            type="success",
            time_ago="1 hour ago",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=1)
        )

        # 6. Seed Notifications
        db.seed_notification(
            user_id=arjun_id,
            title="Task Accepted",
            message="You have accepted the task: 'Street light not working'.",
            read=False,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=5)
        )
        db.seed_notification(
            user_id=arjun_id,
            title="Verification Submitted",
            message="Your proof of work for 'Garbage cleared near 7th Block' has been submitted.",
            read=False,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
        )

        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        raise e
    finally:
        try:
            next(db_gen)
        except StopIteration:
            pass

if __name__ == "__main__":
    seed_db()
